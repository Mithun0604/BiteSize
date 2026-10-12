const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const isVercel = Boolean(process.env.VERCEL);
const dbPath = isVercel
  ? path.join('/tmp', 'bitesize.db')
  : path.resolve(__dirname, '../bitesize.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to persistent SQLite database at:', dbPath);
  }
});

// Promise wrapper helper methods
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

// Enable foreign keys
db.run("PRAGMA foreign_keys = ON;");

// Initialize Database Tables
const initDatabase = async () => {
  try {
    // 1. Users table
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        plan TEXT DEFAULT 'small_bite', -- small_bite, big_bite, shared_bite
        household_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. User Profiles
    await run(`
      CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        display_name TEXT NOT NULL,
        age INTEGER DEFAULT 25,
        gender TEXT DEFAULT 'other',
        height_cm REAL DEFAULT 170,
        weight_kg REAL DEFAULT 68,
        activity_level TEXT DEFAULT 'moderately_active',
        dietary_preference TEXT DEFAULT 'vegetarian', -- vegetarian, vegan, eggetarian, non_veg
        allergies TEXT DEFAULT '[]', -- JSON array
        fitness_goal TEXT DEFAULT 'balanced_health', -- weight_loss, muscle_gain, balanced_health, high_fiber
        calorie_target INTEGER DEFAULT 2100,
        protein_target INTEGER DEFAULT 75,
        carb_target INTEGER DEFAULT 260,
        fat_target INTEGER DEFAULT 60,
        fiber_target INTEGER DEFAULT 30,
        is_primary INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 3. Receipts
    await run(`
      CREATE TABLE IF NOT EXISTS receipts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        store_name TEXT NOT NULL,
        receipt_date TEXT NOT NULL,
        total_amount REAL NOT NULL,
        discount_amount REAL DEFAULT 0,
        tax_amount REAL DEFAULT 0,
        items_count INTEGER DEFAULT 0,
        image_path TEXT,
        ocr_raw_text TEXT,
        category_summary TEXT DEFAULT '{}',
        estimated_total_calories REAL DEFAULT 0,
        estimated_total_protein REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 4. Receipt Items
    await run(`
      CREATE TABLE IF NOT EXISTS receipt_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        receipt_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        quantity REAL DEFAULT 1,
        unit TEXT DEFAULT 'pack',
        price REAL NOT NULL,
        category TEXT DEFAULT 'Pantry & Essentials',
        is_uncertain INTEGER DEFAULT 0,
        confidence_score REAL DEFAULT 0.95,
        matched_product_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 5. Meals (Daily Meal Photo & Manual Logs)
    await run(`
      CREATE TABLE IF NOT EXISTS meals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        profile_id INTEGER,
        meal_name TEXT NOT NULL,
        meal_type TEXT DEFAULT 'lunch', -- breakfast, lunch, dinner, snack
        image_path TEXT,
        is_ai_estimated INTEGER DEFAULT 1,
        confidence_score REAL DEFAULT 0.88,
        uncertainty_range TEXT DEFAULT '±12%',
        cooking_method TEXT DEFAULT 'Tempered / Light Sauté',
        added_oil TEXT DEFAULT '1 tsp Ghee / Oil',
        portion_grams REAL DEFAULT 250,
        calories REAL DEFAULT 350,
        protein REAL DEFAULT 12,
        carbs REAL DEFAULT 45,
        fat REAL DEFAULT 10,
        fiber REAL DEFAULT 5,
        sugar REAL DEFAULT 2,
        sodium REAL DEFAULT 280,
        verified_status TEXT DEFAULT 'user_confirmed', -- ai_provisional, user_confirmed, verified_label
        notes TEXT,
        logged_date TEXT NOT NULL, -- YYYY-MM-DD
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 6. Meal Ingredients details
    await run(`
      CREATE TABLE IF NOT EXISTS meal_ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meal_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        portion_grams REAL DEFAULT 100,
        calories REAL DEFAULT 100,
        protein REAL DEFAULT 5,
        carbs REAL DEFAULT 15,
        fat REAL DEFAULT 2,
        fiber REAL DEFAULT 2,
        is_ai_identified INTEGER DEFAULT 1,
        FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE
      )
    `);

    // 7. Pantry Items
    await run(`
      CREATE TABLE IF NOT EXISTS pantry_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        category TEXT DEFAULT 'Grains & Pulses',
        quantity REAL DEFAULT 1,
        unit TEXT DEFAULT 'kg',
        expiry_date TEXT,
        days_remaining INTEGER DEFAULT 14,
        source_receipt_id INTEGER,
        is_low INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 8. Grocery Budgets
    await run(`
      CREATE TABLE IF NOT EXISTS grocery_budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        month_year TEXT NOT NULL, -- YYYY-MM
        monthly_budget REAL DEFAULT 8000,
        alert_threshold_percent INTEGER DEFAULT 80,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 9. Shopping List
    await run(`
      CREATE TABLE IF NOT EXISTS shopping_list (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        category TEXT DEFAULT 'Pantry & Essentials',
        quantity REAL DEFAULT 1,
        unit TEXT DEFAULT 'pack',
        estimated_price REAL DEFAULT 50,
        is_checked INTEGER DEFAULT 0,
        added_reason TEXT DEFAULT 'manual', -- manual, what_if_swap, low_pantry, recipe_ingredient
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 10. AI Coach Chat Messages
    await run(`
      CREATE TABLE IF NOT EXISTS coach_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        role TEXT NOT NULL, -- user, assistant
        message TEXT NOT NULL,
        context_summary TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 11. Monthly Goals
    await run(`
      CREATE TABLE IF NOT EXISTS monthly_goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        month_year TEXT NOT NULL,
        goal_title TEXT NOT NULL,
        goal_type TEXT NOT NULL, -- budget, protein, meal_logging, low_waste
        target_value REAL NOT NULL,
        current_value REAL DEFAULT 0,
        is_achieved INTEGER DEFAULT 0,
        unit TEXT DEFAULT 'points',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 12. Bite Currency Rewards
    await run(`
      CREATE TABLE IF NOT EXISTS bite_currency_rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        month_year TEXT NOT NULL,
        eligible_grocery_spend REAL DEFAULT 0,
        reward_percentage REAL DEFAULT 7.5,
        currency_amount REAL DEFAULT 0,
        status TEXT DEFAULT 'in_progress', -- in_progress, eligible, redeemed
        redemption_partner TEXT DEFAULT 'First Club',
        redemption_voucher_code TEXT,
        redeemed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 13. Subscriptions & Transactions
    await run(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        plan_id TEXT DEFAULT 'small_bite',
        status TEXT DEFAULT 'active',
        billing_period TEXT DEFAULT 'monthly',
        price_inr REAL DEFAULT 0,
        next_billing_date TEXT,
        razorpay_sub_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS payment_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        payment_id TEXT NOT NULL,
        order_id TEXT NOT NULL,
        amount_inr REAL NOT NULL,
        status TEXT DEFAULT 'success',
        plan_id TEXT NOT NULL,
        is_sandbox INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 14. Household Members (For Shared Bite family plan)
    await run(`
      CREATE TABLE IF NOT EXISTS household_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        relation TEXT DEFAULT 'Partner / Family',
        daily_calorie_target INTEGER DEFAULT 2000,
        dietary_preference TEXT DEFAULT 'vegetarian',
        allergies TEXT DEFAULT '[]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables successfully verified and initialized.');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

module.exports = {
  db,
  run,
  get,
  all,
  initDatabase
};
