const path = require('path');
const { run, get, all } = require('../config/database');
const { parseReceipt } = require('../services/receiptOcrService');
const { checkPlanLimit } = require('../services/paymentService');

/**
 * Scan receipt image or PDF
 */
const scanReceipt = async (req, res) => {
  try {
    const limitCheck = await checkPlanLimit(req.user.id, 'receipt_scan');
    if (!limitCheck.allowed) {
      return res.status(403).json({
        success: false,
        limitReached: true,
        message: limitCheck.message
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a receipt image or PDF.' });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const filename = req.file.originalname;

    const parsed = await parseReceipt({ filePath, mimeType, filename });

    res.json({
      success: true,
      data: {
        ...parsed,
        uploadedFilePath: `/uploads/${path.basename(filePath)}`
      }
    });
  } catch (error) {
    console.error('scanReceipt error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      code: error.code || 'RECEIPT_SCAN_FAILED',
      message: error.statusCode ? error.message : 'Receipt extraction failed. Please try again.'
    });
  }
};

/**
 * Confirm and save parsed receipt + items + auto-sync pantry
 */
const confirmReceipt = async (req, res) => {
  try {
    const {
      storeName,
      receiptDate,
      totalAmount,
      discountAmount,
      taxAmount,
      imagePath,
      rawText,
      items,
      autoAddToPantry
    } = req.body;

    if (!storeName?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(String(receiptDate || '')) || !Number.isFinite(Number(totalAmount)) || Number(totalAmount) < 0 || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Missing required receipt details or items.' });
    }

    // Category summary
    const categorySummary = {};
    items.forEach(item => {
      const cat = item.category || 'Pantry & Essentials';
      categorySummary[cat] = (categorySummary[cat] || 0) + Number(item.price);
    });

    const receiptResult = await run(
      `INSERT INTO receipts (
        user_id, store_name, receipt_date, total_amount, discount_amount,
        tax_amount, items_count, image_path, ocr_raw_text, category_summary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        storeName,
        receiptDate,
        totalAmount,
        discountAmount || 0,
        taxAmount || 0,
        items.length,
        imagePath || null,
        rawText || '',
        JSON.stringify(categorySummary)
      ]
    );

    const receiptId = receiptResult.id;

    // Insert line items & optionally auto-add eligible foods to Pantry
    for (const item of items) {
      await run(
        `INSERT INTO receipt_items (
          receipt_id, user_id, name, quantity, unit, price, category, is_uncertain, confidence_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          receiptId,
          req.user.id,
          item.name,
          item.quantity || 1,
          item.unit || 'pack',
          item.price,
          item.category || 'Pantry & Essentials',
          item.isUncertain ? 1 : 0,
          item.confidenceScore || 0.95
        ]
      );

      // Add to pantry if requested and not household cleaner
      if (autoAddToPantry && item.category !== 'Household') {
        const days = item.category === 'Fresh Produce' ? 4 : item.category === 'Dairy & Eggs' ? 6 : 60;
        await run(
          `INSERT INTO pantry_items (user_id, name, category, quantity, unit, days_remaining, source_receipt_id)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            req.user.id,
            item.name,
            item.category || 'Grains & Pulses',
            item.quantity || 1,
            item.unit || 'pack',
            days,
            receiptId
          ]
        );
      }
    }

    // Update monthly eligible grocery spend for Bite Currency
    const currentMonth = receiptDate.slice(0, 7);
    const monthlyGoals = await all(
      'SELECT target_value, current_value, is_achieved FROM monthly_goals WHERE user_id = ? AND month_year = ?',
      [req.user.id, currentMonth]
    );
    const achievedGoals = monthlyGoals.filter(goal => goal.is_achieved || goal.current_value >= goal.target_value).length;
    const eligibleForReward = monthlyGoals.length > 0 && achievedGoals >= Math.ceil(monthlyGoals.length / 2);
    const existingReward = await get(
      `SELECT * FROM bite_currency_rewards WHERE user_id = ? AND month_year = ?`,
      [req.user.id, currentMonth]
    );

    if (existingReward) {
      const newSpend = existingReward.eligible_grocery_spend + Number(totalAmount);
      const newReward = eligibleForReward ? +(newSpend * 0.075).toFixed(2) : 0;
      await run(
        `UPDATE bite_currency_rewards SET eligible_grocery_spend = ?, currency_amount = ?, status = ? WHERE id = ?`,
        [newSpend, newReward, eligibleForReward ? 'eligible' : 'in_progress', existingReward.id]
      );
    } else {
      const reward = eligibleForReward ? +(Number(totalAmount) * 0.075).toFixed(2) : 0;
      await run(
        `INSERT INTO bite_currency_rewards (user_id, month_year, eligible_grocery_spend, currency_amount, status)
         VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, currentMonth, Number(totalAmount), reward, eligibleForReward ? 'eligible' : 'in_progress']
      );
    }

    res.status(201).json({
      success: true,
      message: 'Receipt and line items saved successfully!',
      receiptId
    });
  } catch (error) {
    console.error('confirmReceipt error:', error);
    res.status(500).json({ success: false, message: 'Failed to confirm receipt.' });
  }
};

/**
 * Get all receipts for user
 */
const getReceipts = async (req, res) => {
  try {
    const receipts = await all(
      'SELECT * FROM receipts WHERE user_id = ? ORDER BY receipt_date DESC',
      [req.user.id]
    );

    const parsedReceipts = receipts.map(r => ({
      ...r,
      categorySummary: JSON.parse(r.category_summary || '{}')
    }));

    res.json({ success: true, receipts: parsedReceipts });
  } catch (error) {
    console.error('getReceipts error:', error);
    res.status(500).json({ success: false, message: 'Failed to load receipts.' });
  }
};

/**
 * Get single receipt with items
 */
const getReceiptDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const receipt = await get('SELECT * FROM receipts WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!receipt) return res.status(404).json({ success: false, message: 'Receipt not found.' });

    const items = await all('SELECT * FROM receipt_items WHERE receipt_id = ? ORDER BY id ASC', [id]);

    res.json({
      success: true,
      receipt: {
        ...receipt,
        categorySummary: JSON.parse(receipt.category_summary || '{}')
      },
      items
    });
  } catch (error) {
    console.error('getReceiptDetails error:', error);
    res.status(500).json({ success: false, message: 'Failed to load receipt details.' });
  }
};

/**
 * Delete a receipt
 */
const deleteReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM receipts WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ success: true, message: 'Receipt deleted.' });
  } catch (error) {
    console.error('deleteReceipt error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete receipt.' });
  }
};

module.exports = {
  scanReceipt,
  confirmReceipt,
  getReceipts,
  getReceiptDetails,
  deleteReceipt
};
