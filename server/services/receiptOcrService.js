const fs = require('fs');
const { generateGeminiContent, parseGeminiJson, GeminiServiceError } = require('./geminiClient');

/**
 * Receipt OCR Service
 * Parses store names, item lines, quantities, unit prices, discounts, and totals.
 * Handles both Gemini Multimodal OCR and intelligent rule-based parsing for Indian grocery formats
 * (Reliance Smart, Blinkit, Zepto, DMart, BigBasket, Nature's Basket).
 */
const parseReceipt = async ({ filePath, mimeType, filename }) => {
  const prompt = `Read this grocery receipt image or PDF. Return JSON only with this structure:
{"storeName":"store name or Unknown store","receiptDate":"YYYY-MM-DD or null","totalAmount":0,"discountAmount":0,"taxAmount":0,"rawText":"visible text","items":[{"name":"exact visible product description","quantity":1,"unit":"pack","price":0,"category":"Grains & Pulses","isUncertain":false,"confidenceScore":0.9}]}
Transcribe only information visible in the receipt. Do not invent products, prices, quantities, discounts, or totals. Each line item's price must be the amount printed for that line. Categories must be one of Grains & Pulses, Dairy & Eggs, Fresh Produce, Healthy Snacks, Pantry & Spices, Household, or Other. Mark uncertain items when text or amounts are unclear. If the receipt cannot be read, return an empty items array and explain that in rawText.`;

  const text = await generateGeminiContent({
    prompt,
    filePath,
    mimeType: mimeType || 'image/jpeg',
    responseMimeType: 'application/json'
  });
  const parsed = parseGeminiJson(text);
  if (!Array.isArray(parsed.items) || parsed.items.length === 0) {
    throw new GeminiServiceError(parsed.rawText || 'No receipt line items could be read. Please upload a clearer image or PDF.', 422, 'RECEIPT_UNREADABLE');
  }
  return postProcessReceipt(parsed);

  // Legacy filename-based sample receipts below are intentionally unreachable.
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && mimeType.startsWith('image/')) {
    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const imageBuffer = fs.readFileSync(filePath);
      const imagePart = {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: mimeType || "image/jpeg"
        }
      };

      const prompt = `Perform OCR and grocery receipt extraction on this invoice image.
Extract the store name, transaction date, line items with quantities, units, and item prices, discounts, taxes, and total bill amount.
Return a STRICT JSON response ONLY (no markdown backticks, just raw JSON):
{
  "storeName": "Store or Supermarket name",
  "receiptDate": "YYYY-MM-DD",
  "totalAmount": 1250.00,
  "discountAmount": 75.00,
  "taxAmount": 45.00,
  "rawText": "Extracted invoice text lines...",
  "items": [
    {
      "name": "Item name",
      "quantity": 1,
      "unit": "kg" | "pack" | "L" | "piece",
      "price": 120.00,
      "category": "Grains & Pulses" | "Dairy & Eggs" | "Fresh Produce" | "Healthy Snacks" | "Pantry & Spices" | "Household",
      "isUncertain": false,
      "confidenceScore": 0.95
    }
  ]
}`;

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text().trim();
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return postProcessReceipt(parsed);
    } catch (err) {
      console.warn("Gemini Receipt OCR failed, fallback to pattern parser:", err.message);
    }
  }

  // Fallback pattern parser
  return fallbackReceiptParser({ filename });
};

/**
 * Intelligent fallback parser with authentic Indian supermarket item sets
 */
const fallbackReceiptParser = ({ filename = "" }) => {
  const lower = filename.toLowerCase();

  let receiptData;

  if (lower.includes("blinkit") || lower.includes("zepto") || lower.includes("instamart")) {
    receiptData = {
      storeName: "Blinkit Quick Commerce",
      receiptDate: new Date().toISOString().slice(0, 10),
      discountAmount: 45.00,
      taxAmount: 28.50,
      items: [
        { name: "Epigamia Natural Greek Yogurt 200g", quantity: 2, unit: "pack", price: 160.00, category: "Dairy & Eggs", isUncertain: false, confidenceScore: 0.98 },
        { name: "Raw Rolled Oats 500g", quantity: 1, unit: "pack", price: 135.00, category: "Grains & Pulses", isUncertain: false, confidenceScore: 0.96 },
        { name: "Organic Robusta Bananas (500g)", quantity: 1, unit: "pack", price: 42.00, category: "Fresh Produce", isUncertain: false, confidenceScore: 0.95 },
        { name: "Roasted Makhana Himalayan Pink Salt", quantity: 1, unit: "pack", price: 140.00, category: "Healthy Snacks", isUncertain: false, confidenceScore: 0.94 },
        { name: "Amul Pure Cow Ghee 200ml", quantity: 1, unit: "jar", price: 155.00, category: "Pantry & Spices", isUncertain: false, confidenceScore: 0.92 }
      ]
    };
  } else if (lower.includes("dmart") || lower.includes("spencer")) {
    receiptData = {
      storeName: "DMart Hypermarket",
      receiptDate: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
      discountAmount: 180.00,
      taxAmount: 72.00,
      items: [
        { name: "Fortune Sona Masoori Rice 5kg", quantity: 1, unit: "bag", price: 325.00, category: "Grains & Pulses", isUncertain: false, confidenceScore: 0.97 },
        { name: "Tata Sampann Chana Dal 1kg", quantity: 2, unit: "kg", price: 198.00, category: "Grains & Pulses", isUncertain: false, confidenceScore: 0.96 },
        { name: "Aashirvaad Select Sharbati Atta 5kg", quantity: 1, unit: "bag", price: 295.00, category: "Grains & Pulses", isUncertain: false, confidenceScore: 0.99 },
        { name: "Amul Taaza Toned Milk 1L", quantity: 4, unit: "pouch", price: 216.00, category: "Dairy & Eggs", isUncertain: false, confidenceScore: 0.97 },
        { name: "Catch Turmeric Powder 200g", quantity: 1, unit: "pack", price: 48.00, category: "Pantry & Spices", isUncertain: true, confidenceScore: 0.84 }
      ]
    };
  } else {
    // Default Reliance Smart Supermarket receipt
    receiptData = {
      storeName: "Reliance Smart Superstore",
      receiptDate: new Date().toISOString().slice(0, 10),
      discountAmount: 110.00,
      taxAmount: 54.00,
      items: [
        { name: "Tata Sampann High Protein Toor Dal 1kg", quantity: 2, unit: "kg", price: 340.00, category: "Grains & Pulses", isUncertain: false, confidenceScore: 0.96 },
        { name: "Fresh Country Paneer 250g", quantity: 2, unit: "pack", price: 185.00, category: "Dairy & Eggs", isUncertain: false, confidenceScore: 0.95 },
        { name: "Farm Fresh Hydroponic Spinach 250g", quantity: 2, unit: "pack", price: 55.00, category: "Fresh Produce", isUncertain: false, confidenceScore: 0.91 },
        { name: "Saffola Honey Gold 250g", quantity: 1, unit: "bottle", price: 120.00, category: "Pantry & Spices", isUncertain: true, confidenceScore: 0.85 },
        { name: "Loose Country Eggs Pack of 6", quantity: 2, unit: "tray", price: 130.00, category: "Dairy & Eggs", isUncertain: false, confidenceScore: 0.97 },
        { name: "English Cucumber 500g", quantity: 1, unit: "kg", price: 35.00, category: "Fresh Produce", isUncertain: false, confidenceScore: 0.89 }
      ]
    };
  }

  const calculatedTotal = receiptData.items.reduce((sum, item) => sum + item.price, 0);
  receiptData.totalAmount = +(calculatedTotal - (receiptData.discountAmount || 0)).toFixed(2);
  receiptData.rawText = `Invoice generated by ${receiptData.storeName}\nDate: ${receiptData.receiptDate}\nItems: ${receiptData.items.length}\nTotal: ₹${receiptData.totalAmount}`;

  return postProcessReceipt(receiptData);
};

const postProcessReceipt = (receipt) => {
  const allowedCategories = new Set(['Grains & Pulses', 'Dairy & Eggs', 'Fresh Produce', 'Healthy Snacks', 'Pantry & Spices', 'Household', 'Other']);
  const items = receipt.items.map((item) => {
    const name = typeof item.name === 'string' ? item.name.trim() : '';
    const price = Number(item.price);
    const quantity = Number(item.quantity || 1);
    const confidence = Number(item.confidenceScore);
    if (!name || !Number.isFinite(price) || price < 0 || !Number.isFinite(quantity) || quantity <= 0) {
      throw new GeminiServiceError('Some receipt lines were missing a readable name, quantity, or price. Review the receipt or upload a clearer image.', 422, 'RECEIPT_LINE_UNCERTAIN');
    }
    return {
      ...item,
      name,
      price,
      quantity,
      unit: typeof item.unit === 'string' && item.unit.trim() ? item.unit.trim() : 'unit',
      category: allowedCategories.has(item.category) ? item.category : 'Other',
      confidenceScore: Number.isFinite(confidence) ? Math.max(0, Math.min(confidence, 1)) : 0,
      isUncertain: Boolean(item.isUncertain) || !Number.isFinite(confidence) || confidence < 0.75
    };
  });
  const totalAmount = Number(receipt.totalAmount);
  if (!Number.isFinite(totalAmount) || totalAmount < 0) {
    throw new GeminiServiceError('The receipt total could not be read. Check the extracted lines and try a clearer image.', 422, 'RECEIPT_TOTAL_UNCERTAIN');
  }

  // Category spending summary
  const categorySummary = {};
  items.forEach(item => {
    categorySummary[item.category] = (categorySummary[item.category] || 0) + item.price;
  });

  return {
    ...receipt,
    storeName: typeof receipt.storeName === 'string' && receipt.storeName.trim() ? receipt.storeName.trim() : 'Unknown store',
    totalAmount,
    discountAmount: Number.isFinite(Number(receipt.discountAmount)) ? Number(receipt.discountAmount) : 0,
    taxAmount: Number.isFinite(Number(receipt.taxAmount)) ? Number(receipt.taxAmount) : 0,
    items,
    itemsCount: items.length,
    categorySummary,
    estimatedTotalCalories: null,
    estimatedTotalProtein: null,
    nutritionStatus: 'not_estimated_from_receipt',
    pantryAddableCount: items.filter(i => i.category !== 'Household').length
  };
};

module.exports = { parseReceipt };
