const path = require('path');
const { run, get, all } = require('../config/database');
const { analyzeMealImage } = require('../services/aiVisionService');
const { checkPlanLimit } = require('../services/paymentService');

/**
 * Scan and analyze meal image
 */
const scanMeal = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a meal photo.' });
    }

    // Check limits before using CPU, but only confirmed meal logs count toward the limit.
    const limitCheck = await checkPlanLimit(req.user.id, 'meal_scan');
    if (!limitCheck.allowed) {
      return res.status(403).json({
        success: false,
        limitReached: true,
        message: limitCheck.message
      });
    }

    const imagePath = req.file.path;
    const mimeType = req.file.mimetype;
    const filename = req.file.originalname;

    // Call precision AI Vision & nutrition engine
    const analysis = await analyzeMealImage({ imagePath, mimeType, filename });

    res.json({
      success: true,
      data: {
        ...analysis,
        uploadedImagePath: `/uploads/${path.basename(imagePath)}`
      }
    });
  } catch (error) {
    console.error('scanMeal error:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      code: error.code || 'MEAL_SCAN_FAILED',
      message: error.statusCode ? error.message : 'Meal photo analysis failed. Please try again.'
    });
  }
};

/**
 * Confirm and save meal entry to daily log
 */
const confirmAndSaveMeal = async (req, res) => {
  try {
    const {
      mealName,
      mealType,
      imagePath,
      portionGrams,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      sodium,
      confidenceScore,
      uncertaintyRange,
      cookingMethod,
      addedOil,
      notes,
      loggedDate,
      ingredients
    } = req.body;

    if (!mealName) {
      return res.status(400).json({ success: false, message: 'Meal name is required.' });
    }

    const dateToLog = loggedDate || new Date().toISOString().slice(0, 10);

    const mealResult = await run(
      `INSERT INTO meals (
        user_id, meal_name, meal_type, image_path, is_ai_estimated,
        confidence_score, uncertainty_range, cooking_method, added_oil,
        portion_grams, calories, protein, carbs, fat, fiber, sugar, sodium,
        verified_status, notes, logged_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        mealName,
        mealType || 'lunch',
        imagePath || null,
        1,
        confidenceScore ?? 0.90,
        uncertaintyRange || '±10%',
        cookingMethod || 'Tempered / Light Sauté',
        addedOil || 'None',
        portionGrams || 250,
        calories || 300,
        protein || 10,
        carbs || 40,
        fat || 8,
        fiber || 4,
        sugar || 2,
        sodium || 200,
        'user_confirmed',
        notes || '',
        dateToLog
      ]
    );

    const mealId = mealResult.id;

    // Save individual ingredients if provided
    if (Array.isArray(ingredients) && ingredients.length > 0) {
      for (const ing of ingredients) {
        await run(
          `INSERT INTO meal_ingredients (meal_id, name, portion_grams, calories, protein, carbs, fat, fiber)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            mealId,
            ing.name,
            ing.portionGrams || 100,
            ing.calories || 0,
            ing.protein || 0,
            ing.carbs || 0,
            ing.fat || 0,
            ing.fiber || 0
          ]
        );
      }
    }

    // Update monthly goal progress for meal logging
    const currentMonth = dateToLog.slice(0, 7);
    await run(
      `UPDATE monthly_goals SET current_value = current_value + 1
       WHERE user_id = ? AND month_year = ? AND goal_type = 'meal_logging'`,
      [req.user.id, currentMonth]
    );

    res.status(201).json({
      success: true,
      message: 'Meal saved successfully to your daily nutrition log!',
      mealId
    });
  } catch (error) {
    console.error('confirmAndSaveMeal error:', error);
    res.status(500).json({ success: false, message: 'Failed to persist meal log.' });
  }
};

/**
 * Get daily nutrition logs for a given date (defaults to today)
 */
const getMealsByDate = async (req, res) => {
  try {
    const targetDate = req.query.date || new Date().toISOString().slice(0, 10);
    const meals = await all(
      'SELECT * FROM meals WHERE user_id = ? AND logged_date = ? ORDER BY id DESC',
      [req.user.id, targetDate]
    );

    // Calculate totals
    const totals = meals.reduce(
      (acc, m) => {
        acc.calories += m.calories;
        acc.protein += m.protein;
        acc.carbs += m.carbs;
        acc.fat += m.fat;
        acc.fiber += m.fiber;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );

    totals.calories = Math.round(totals.calories);
    totals.protein = +totals.protein.toFixed(1);
    totals.carbs = +totals.carbs.toFixed(1);
    totals.fat = +totals.fat.toFixed(1);
    totals.fiber = +totals.fiber.toFixed(1);

    res.json({
      success: true,
      date: targetDate,
      totals,
      meals
    });
  } catch (error) {
    console.error('getMealsByDate error:', error);
    res.status(500).json({ success: false, message: 'Failed to load meals.' });
  }
};

/**
 * Get all logged meals for a user (history)
 */
const getAllMeals = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const search = req.query.search ? `%${req.query.search.toLowerCase()}%` : null;

    let query = 'SELECT * FROM meals WHERE user_id = ?';
    const params = [req.user.id];

    if (search) {
      query += ' AND (LOWER(meal_name) LIKE ? OR LOWER(notes) LIKE ?)';
      params.push(search, search);
    }

    query += ' ORDER BY logged_date DESC, id DESC LIMIT ?';
    params.push(limit);

    const meals = await all(query, params);

    res.json({
      success: true,
      count: meals.length,
      meals
    });
  } catch (error) {
    console.error('getAllMeals error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve meal history.' });
  }
};

/**
 * Delete a meal entry
 */
const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM meals WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ success: true, message: 'Meal entry removed.' });
  } catch (error) {
    console.error('deleteMeal error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete meal.' });
  }
};

module.exports = {
  scanMeal,
  confirmAndSaveMeal,
  getMealsByDate,
  getAllMeals,
  deleteMeal
};
