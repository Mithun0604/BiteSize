const bcrypt = require('bcryptjs');
const { run, get, all } = require('../config/database');

const seedDemoUser = async () => {
  try {
    const existingUser = await get('SELECT * FROM users WHERE email = ?', ['demo@bitesize.app']);
    if (existingUser) {
      // User already exists, skip seeding to avoid duplicate data
      return existingUser;
    }

    console.log('Seeding initial demo user and data for BiteSize...');
    const hashedPassword = await bcrypt.hash('bitesize123', 10);

    const userResult = await run(
      `INSERT INTO users (email, password_hash, full_name, plan) VALUES (?, ?, ?, ?)`,
      ['demo@bitesize.app', hashedPassword, 'Aarav Sharma', 'big_bite']
    );
    const userId = userResult.id;

    // Profile
    await run(
      `INSERT INTO profiles (user_id, display_name, age, gender, height_cm, weight_kg, activity_level, dietary_preference, allergies, fitness_goal, calorie_target, protein_target, carb_target, fat_target, fiber_target)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        'Aarav',
        26,
        'male',
        174,
        69.5,
        'moderately_active',
        'vegetarian',
        JSON.stringify(['peanuts']),
        'muscle_gain',
        2200,
        85,
        250,
        60,
        32
      ]
    );

    // Subscription record
    await run(
      `INSERT INTO subscriptions (user_id, plan_id, status, billing_period, price_inr, next_billing_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, 'big_bite', 'active', 'monthly', 199, '2026-11-15']
    );

    // Monthly Budget for current month
    const currentMonth = new Date().toISOString().slice(0, 7);
    await run(
      `INSERT INTO grocery_budgets (user_id, month_year, monthly_budget, alert_threshold_percent)
       VALUES (?, ?, ?, ?)`,
      [userId, currentMonth, 7500, 80]
    );

    // Sample Receipts
    // Receipt 1: Reliance Fresh
    const r1 = await run(
      `INSERT INTO receipts (user_id, store_name, receipt_date, total_amount, discount_amount, tax_amount, items_count, estimated_total_calories, estimated_total_protein, category_summary)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        'Reliance Smart Bazaar',
        '2026-10-08',
        1845.50,
        140.00,
        88.00,
        6,
        4850,
        142,
        JSON.stringify({ "Grains & Pulses": 680, "Dairy & Eggs": 520, "Fresh Produce": 340, "Pantry & Spices": 305.5 })
      ]
    );

    const r1Items = [
      { name: 'Fortune Sona Masoori Rice 5kg', qty: 1, unit: 'bag', price: 340, cat: 'Grains & Pulses', conf: 0.98, unc: 0 },
      { name: 'Tata Sampann Toor Dal 1kg', qty: 2, unit: 'kg', price: 340, cat: 'Grains & Pulses', conf: 0.95, unc: 0 },
      { name: 'Amul Malai Paneer 200g', qty: 2, unit: 'pack', price: 190, cat: 'Dairy & Eggs', conf: 0.99, unc: 0 },
      { name: 'Mother Dairy Toned Milk 1L', qty: 3, unit: 'pouch', price: 165, cat: 'Dairy & Eggs', conf: 0.97, unc: 0 },
      { name: 'Fresh Spinach / Palak 500g', qty: 2, unit: 'bunch', price: 60, cat: 'Fresh Produce', conf: 0.92, unc: 0 },
      { name: 'Onion & Tomato Combo 2kg', qty: 1, unit: 'bag', price: 120, cat: 'Fresh Produce', conf: 0.88, unc: 1 }
    ];

    for (const item of r1Items) {
      await run(
        `INSERT INTO receipt_items (receipt_id, user_id, name, quantity, unit, price, category, confidence_score, is_uncertain)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [r1.id, userId, item.name, item.qty, item.unit, item.price, item.cat, item.conf, item.unc]
      );
    }

    // Receipt 2: Blinkit Quick Commerce
    const r2 = await run(
      `INSERT INTO receipts (user_id, store_name, receipt_date, total_amount, discount_amount, tax_amount, items_count, estimated_total_calories, estimated_total_protein, category_summary)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        'Blinkit Quick Delivery',
        '2026-10-11',
        780.00,
        50.00,
        38.00,
        4,
        2100,
        78,
        JSON.stringify({ "Healthy Snacks": 310, "Dairy & Eggs": 180, "Fresh Produce": 190, "Beverages": 100 })
      ]
    );

    const r2Items = [
      { name: 'Epigamia Greek Yogurt 2x100g', qty: 2, unit: 'cup', price: 140, cat: 'Dairy & Eggs', conf: 0.96, unc: 0 },
      { name: 'Roasted Foxnuts / Makhana 100g', qty: 1, unit: 'pack', price: 170, cat: 'Healthy Snacks', conf: 0.94, unc: 0 },
      { name: 'Robusta Bananas 1kg', qty: 1, unit: 'kg', price: 65, cat: 'Fresh Produce', conf: 0.93, unc: 0 },
      { name: 'Raw Rolled Oats 500g', qty: 1, unit: 'pack', price: 140, cat: 'Grains & Pulses', conf: 0.95, unc: 0 }
    ];

    for (const item of r2Items) {
      await run(
        `INSERT INTO receipt_items (receipt_id, user_id, name, quantity, unit, price, category, confidence_score, is_uncertain)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [r2.id, userId, item.name, item.qty, item.unit, item.price, item.cat, item.conf, item.unc]
      );
    }

    // Seed Pantry Items
    const pantryItems = [
      { name: 'Toor Dal (Pigeon Peas)', category: 'Grains & Pulses', qty: 1.8, unit: 'kg', days: 90, is_low: 0 },
      { name: 'Sona Masoori Rice', category: 'Grains & Pulses', qty: 4.2, unit: 'kg', days: 120, is_low: 0 },
      { name: 'Amul Malai Paneer', category: 'Dairy & Eggs', qty: 200, unit: 'g', days: 3, is_low: 1 },
      { name: 'Fresh Palak (Spinach)', category: 'Fresh Produce', qty: 400, unit: 'g', days: 2, is_low: 1 },
      { name: 'Toned Milk', category: 'Dairy & Eggs', qty: 1, unit: 'L', days: 2, is_low: 0 },
      { name: 'Rolled Oats', category: 'Grains & Pulses', qty: 500, unit: 'g', days: 45, is_low: 0 },
      { name: 'Roasted Makhana', category: 'Healthy Snacks', qty: 100, unit: 'g', days: 30, is_low: 0 },
      { name: 'Greek Yogurt Natural', category: 'Dairy & Eggs', qty: 200, unit: 'g', days: 5, is_low: 0 }
    ];

    for (const p of pantryItems) {
      await run(
        `INSERT INTO pantry_items (user_id, name, category, quantity, unit, days_remaining, is_low)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, p.name, p.category, p.qty, p.unit, p.days, p.is_low]
      );
    }

    // Seed Confirmed Meals for Aarav
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    // Today Breakfast
    await run(
      `INSERT INTO meals (user_id, meal_name, meal_type, is_ai_estimated, confidence_score, uncertainty_range, cooking_method, added_oil, portion_grams, calories, protein, carbs, fat, fiber, sugar, sodium, verified_status, logged_date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        'Rolled Oats with Greek Yogurt & Banana',
        'breakfast',
        1,
        0.94,
        '±8%',
        'No-cook / Soaked',
        'None',
        220,
        340,
        18.5,
        52.0,
        5.2,
        6.4,
        14.0,
        45,
        'user_confirmed',
        today,
        'Added a sprinkle of cinnamon powder'
      ]
    );

    // Today Lunch
    await run(
      `INSERT INTO meals (user_id, meal_name, meal_type, is_ai_estimated, confidence_score, uncertainty_range, cooking_method, added_oil, portion_grams, calories, protein, carbs, fat, fiber, sugar, sodium, verified_status, logged_date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        'Palak Paneer with 2 Whole Wheat Rotis',
        'lunch',
        1,
        0.91,
        '±10%',
        'Sautéed with cumin & garlic',
        '1 tsp Mustard Oil',
        320,
        485,
        24.0,
        46.0,
        21.5,
        7.8,
        3.2,
        320,
        'user_confirmed',
        today,
        'Home cooked with fresh spinach from Reliance'
      ]
    );

    // Yesterday Meals
    await run(
      `INSERT INTO meals (user_id, meal_name, meal_type, is_ai_estimated, confidence_score, uncertainty_range, cooking_method, added_oil, portion_grams, calories, protein, carbs, fat, fiber, sugar, sodium, verified_status, logged_date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        'Moong Dal Tadka with Steamed Rice & Cucumber Salad',
        'lunch',
        1,
        0.93,
        '±9%',
        'Pressure cooked, tempered with ghee & jeera',
        '1/2 tsp Ghee',
        350,
        460,
        17.8,
        74.0,
        8.4,
        6.5,
        2.5,
        290,
        'user_confirmed',
        yesterday,
        'Balanced lunch before afternoon meeting'
      ]
    );

    // Seed Shopping List Items
    const shoppingListSeed = [
      { name: 'Double Toned Milk (Low Fat)', category: 'Dairy & Eggs', qty: 2, unit: 'L', price: 96, reason: 'low_pantry' },
      { name: 'High Protein Moong Sprouts', category: 'Pulses & Legumes', qty: 250, unit: 'g', price: 40, reason: 'what_if_swap' },
      { name: 'Brown Rice Sona Masoori', category: 'Grains & Pulses', qty: 1, unit: 'kg', price: 85, reason: 'what_if_swap' }
    ];

    for (const s of shoppingListSeed) {
      await run(
        `INSERT INTO shopping_list (user_id, name, category, quantity, unit, estimated_price, added_reason)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, s.name, s.category, s.qty, s.unit, s.price, s.reason]
      );
    }

    // Seed Monthly Goals
    await run(
      `INSERT INTO monthly_goals (user_id, month_year, goal_title, goal_type, target_value, current_value, is_achieved, unit)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, currentMonth, 'Stay within ₹7,500 Grocery Budget', 'budget', 7500, 2625.50, 0, '₹']
    );

    await run(
      `INSERT INTO monthly_goals (user_id, month_year, goal_title, goal_type, target_value, current_value, is_achieved, unit)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, currentMonth, 'Log 25 Wholesome Meals with Photo', 'meal_logging', 25, 18, 0, 'meals']
    );

    await run(
      `INSERT INTO monthly_goals (user_id, month_year, goal_title, goal_type, target_value, current_value, is_achieved, unit)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, currentMonth, 'Hit 80g+ Protein Intake on 20 Days', 'protein', 20, 16, 0, 'days']
    );

    // Bite Currency Rewards progress
    // Eligible spend so far = 1845.50 + 780.00 = 2625.50. 7.5% of 2625.50 = ~196.90
    await run(
      `INSERT INTO bite_currency_rewards (user_id, month_year, eligible_grocery_spend, reward_percentage, currency_amount, status, redemption_partner)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, currentMonth, 2625.50, 7.5, 196.91, 'in_progress', 'First Club']
    );

    console.log('Demo user seeded successfully! Login: demo@bitesize.app / bitesize123');
  } catch (error) {
    console.error('Error during data seeding:', error);
  }
};

module.exports = { seedDemoUser };
