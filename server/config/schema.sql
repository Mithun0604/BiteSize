-- ========================================================
-- BiteSize Complete Database Schema (MySQL 8.0 Compatible)
-- "Your groceries, understood."
-- ========================================================

CREATE DATABASE IF NOT EXISTS bitesize_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bitesize_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  plan ENUM('small_bite', 'big_bite', 'shared_bite') DEFAULT 'small_bite',
  household_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  display_name VARCHAR(150) NOT NULL,
  age INT DEFAULT 25,
  gender ENUM('male', 'female', 'non_binary', 'other') DEFAULT 'other',
  height_cm DECIMAL(5,2) DEFAULT 170.00,
  weight_kg DECIMAL(5,2) DEFAULT 68.00,
  activity_level ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active') DEFAULT 'moderately_active',
  dietary_preference ENUM('vegetarian', 'vegan', 'eggetarian', 'non_veg', 'jain') DEFAULT 'vegetarian',
  allergies JSON NULL,
  fitness_goal ENUM('weight_loss', 'muscle_gain', 'balanced_health', 'high_fiber', 'low_sodium') DEFAULT 'balanced_health',
  calorie_target INT DEFAULT 2100,
  protein_target INT DEFAULT 75,
  carb_target INT DEFAULT 260,
  fat_target INT DEFAULT 60,
  fiber_target INT DEFAULT 30,
  is_primary BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_profile_user (user_id)
) ENGINE=InnoDB;

-- 3. Grocery Receipts Table
CREATE TABLE IF NOT EXISTS receipts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  store_name VARCHAR(200) NOT NULL,
  receipt_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  items_count INT DEFAULT 0,
  image_path VARCHAR(500) NULL,
  ocr_raw_text TEXT NULL,
  category_summary JSON NULL,
  estimated_total_calories DECIMAL(8,2) DEFAULT 0.00,
  estimated_total_protein DECIMAL(8,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_receipt_user_date (user_id, receipt_date)
) ENGINE=InnoDB;

-- 4. Extracted Receipt Items Table
CREATE TABLE IF NOT EXISTS receipt_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  receipt_id INT NOT NULL,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  quantity DECIMAL(8,2) DEFAULT 1.00,
  unit VARCHAR(50) DEFAULT 'pack',
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) DEFAULT 'Pantry & Essentials',
  is_uncertain BOOLEAN DEFAULT FALSE,
  confidence_score DECIMAL(4,3) DEFAULT 0.950,
  matched_product_id VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_item_receipt (receipt_id)
) ENGINE=InnoDB;

-- 5. Meals (Daily Intake Photo & Manual Logs) Table
CREATE TABLE IF NOT EXISTS meals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  profile_id INT NULL,
  meal_name VARCHAR(255) NOT NULL,
  meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') DEFAULT 'lunch',
  image_path VARCHAR(500) NULL,
  is_ai_estimated BOOLEAN DEFAULT TRUE,
  confidence_score DECIMAL(4,3) DEFAULT 0.880,
  uncertainty_range VARCHAR(50) DEFAULT '±12%',
  cooking_method VARCHAR(100) DEFAULT 'Tempered / Light Sauté',
  added_oil VARCHAR(100) DEFAULT '1 tsp Ghee / Oil',
  portion_grams DECIMAL(8,2) DEFAULT 250.00,
  calories DECIMAL(8,2) DEFAULT 350.00,
  protein DECIMAL(8,2) DEFAULT 12.00,
  carbs DECIMAL(8,2) DEFAULT 45.00,
  fat DECIMAL(8,2) DEFAULT 10.00,
  fiber DECIMAL(8,2) DEFAULT 5.00,
  sugar DECIMAL(8,2) DEFAULT 2.00,
  sodium DECIMAL(8,2) DEFAULT 280.00,
  verified_status ENUM('ai_provisional', 'user_confirmed', 'verified_label') DEFAULT 'user_confirmed',
  notes TEXT NULL,
  logged_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_meal_user_date (user_id, logged_date)
) ENGINE=InnoDB;

-- 6. Meal Ingredients Decomposition Table
CREATE TABLE IF NOT EXISTS meal_ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  meal_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  portion_grams DECIMAL(8,2) DEFAULT 100.00,
  calories DECIMAL(8,2) DEFAULT 100.00,
  protein DECIMAL(8,2) DEFAULT 5.00,
  carbs DECIMAL(8,2) DEFAULT 15.00,
  fat DECIMAL(8,2) DEFAULT 2.00,
  fiber DECIMAL(8,2) DEFAULT 2.00,
  is_ai_identified BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Pantry Items Table
CREATE TABLE IF NOT EXISTS pantry_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'Grains & Pulses',
  quantity DECIMAL(8,2) DEFAULT 1.00,
  unit VARCHAR(50) DEFAULT 'kg',
  expiry_date DATE NULL,
  days_remaining INT DEFAULT 14,
  source_receipt_id INT NULL,
  is_low BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_pantry_user (user_id)
) ENGINE=InnoDB;

-- 8. Grocery Budgets Table
CREATE TABLE IF NOT EXISTS grocery_budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  monthly_budget DECIMAL(10,2) DEFAULT 8000.00,
  alert_threshold_percent INT DEFAULT 80,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_month (user_id, month_year)
) ENGINE=InnoDB;

-- 9. Smart Shopping List Table
CREATE TABLE IF NOT EXISTS shopping_list (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'Pantry & Essentials',
  quantity DECIMAL(8,2) DEFAULT 1.00,
  unit VARCHAR(50) DEFAULT 'pack',
  estimated_price DECIMAL(10,2) DEFAULT 50.00,
  is_checked BOOLEAN DEFAULT FALSE,
  added_reason ENUM('manual', 'what_if_swap', 'low_pantry', 'recipe_ingredient') DEFAULT 'manual',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. AI Coach Chat Log Table
CREATE TABLE IF NOT EXISTS coach_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  role ENUM('user', 'assistant') NOT NULL,
  message TEXT NOT NULL,
  context_summary TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_coach_user (user_id)
) ENGINE=InnoDB;

-- 11. Monthly Goals Table
CREATE TABLE IF NOT EXISTS monthly_goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  month_year VARCHAR(7) NOT NULL,
  goal_title VARCHAR(255) NOT NULL,
  goal_type ENUM('budget', 'protein', 'meal_logging', 'low_waste') NOT NULL,
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0.00,
  is_achieved BOOLEAN DEFAULT FALSE,
  unit VARCHAR(50) DEFAULT 'points',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. Bite Currency Rewards Table
CREATE TABLE IF NOT EXISTS bite_currency_rewards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  month_year VARCHAR(7) NOT NULL,
  eligible_grocery_spend DECIMAL(10,2) DEFAULT 0.00,
  reward_percentage DECIMAL(4,2) DEFAULT 7.50,
  currency_amount DECIMAL(10,2) DEFAULT 0.00,
  status ENUM('in_progress', 'eligible', 'redeemed') DEFAULT 'in_progress',
  redemption_partner VARCHAR(100) DEFAULT 'First Club',
  redemption_voucher_code VARCHAR(100) NULL,
  redeemed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_reward_user (user_id)
) ENGINE=InnoDB;

-- 13. Subscriptions & Payments
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  plan_id ENUM('small_bite', 'big_bite', 'shared_bite') DEFAULT 'small_bite',
  status ENUM('active', 'trialing', 'cancelled', 'past_due') DEFAULT 'active',
  billing_period ENUM('monthly', 'annual') DEFAULT 'monthly',
  price_inr DECIMAL(10,2) DEFAULT 0.00,
  next_billing_date DATE NULL,
  razorpay_sub_id VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payment_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  payment_id VARCHAR(100) NOT NULL,
  order_id VARCHAR(100) NOT NULL,
  amount_inr DECIMAL(10,2) NOT NULL,
  status ENUM('success', 'failed', 'pending', 'refunded') DEFAULT 'success',
  plan_id VARCHAR(50) NOT NULL,
  is_sandbox BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. Household Members (For Shared Bite family plan)
CREATE TABLE IF NOT EXISTS household_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NULL,
  relation VARCHAR(100) DEFAULT 'Partner / Family',
  daily_calorie_target INT DEFAULT 2000,
  dietary_preference VARCHAR(50) DEFAULT 'vegetarian',
  allergies JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
