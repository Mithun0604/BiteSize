const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { run, get, all } = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

const register = async (req, res) => {
  try {
    if (!JWT_SECRET) return res.status(503).json({ success: false, message: 'Authentication is not configured. Set JWT_SECRET on the server.' });
    const { email, password, fullName, dietaryPreference, fitnessGoal } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'Please provide email, password, and full name.' });
    }

    const existing = await get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userResult = await run(
      `INSERT INTO users (email, password_hash, full_name, plan) VALUES (?, ?, ?, 'small_bite')`,
      [email.toLowerCase().trim(), passwordHash, fullName.trim()]
    );
    const userId = userResult.id;

    // Create default profile
    await run(
      `INSERT INTO profiles (user_id, display_name, dietary_preference, fitness_goal)
       VALUES (?, ?, ?, ?)`,
      [userId, fullName.split(' ')[0], dietaryPreference || 'vegetarian', fitnessGoal || 'balanced_health']
    );

    // Create free subscription
    await run(
      `INSERT INTO subscriptions (user_id, plan_id, status, price_inr)
       VALUES (?, 'small_bite', 'active', 0)`,
      [userId]
    );

    // Create monthly budget record
    const currentMonth = new Date().toISOString().slice(0, 7);
    await run(
      `INSERT INTO grocery_budgets (user_id, month_year, monthly_budget)
       VALUES (?, ?, 6000)`,
      [userId, currentMonth]
    );

    // Initial Bite Currency entry
    await run(
      `INSERT INTO bite_currency_rewards (user_id, month_year, eligible_grocery_spend, currency_amount, status)
       VALUES (?, ?, 0, 0, 'in_progress')`,
      [userId, currentMonth]
    );

    const token = jwt.sign({ id: userId, email: email.toLowerCase().trim() }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: userId,
        email: email.toLowerCase().trim(),
        fullName: fullName.trim(),
        plan: 'small_bite'
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

const login = async (req, res) => {
  try {
    if (!JWT_SECRET) return res.status(503).json({ success: false, message: 'Authentication is not configured. Set JWT_SECRET on the server.' });
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Fetch profile
    const profile = await get('SELECT * FROM profiles WHERE user_id = ? AND is_primary = 1', [user.id]);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        plan: user.plan
      },
      profile
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await get('SELECT id, email, full_name, plan, created_at FROM users WHERE id = ?', [req.user.id]);
    const profile = await get('SELECT * FROM profiles WHERE user_id = ? AND is_primary = 1', [req.user.id]);
    const subscription = await get('SELECT * FROM subscriptions WHERE user_id = ?', [req.user.id]);

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.json({
      success: true,
      user,
      profile: {
        ...profile,
        allergies: JSON.parse(profile?.allergies || '[]')
      },
      subscription
    });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      displayName,
      age,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      dietaryPreference,
      allergies,
      fitnessGoal,
      calorieTarget,
      proteinTarget,
      carbTarget,
      fatTarget,
      fiberTarget,
      monthlyBudget
    } = req.body;

    await run(
      `UPDATE profiles SET
        display_name = COALESCE(?, display_name),
        age = COALESCE(?, age),
        gender = COALESCE(?, gender),
        height_cm = COALESCE(?, height_cm),
        weight_kg = COALESCE(?, weight_kg),
        activity_level = COALESCE(?, activity_level),
        dietary_preference = COALESCE(?, dietary_preference),
        allergies = COALESCE(?, allergies),
        fitness_goal = COALESCE(?, fitness_goal),
        calorie_target = COALESCE(?, calorie_target),
        protein_target = COALESCE(?, protein_target),
        carb_target = COALESCE(?, carb_target),
        fat_target = COALESCE(?, fat_target),
        fiber_target = COALESCE(?, fiber_target)
       WHERE user_id = ? AND is_primary = 1`,
      [
        displayName,
        age,
        gender,
        heightCm,
        weightKg,
        activityLevel,
        dietaryPreference,
        allergies ? JSON.stringify(allergies) : null,
        fitnessGoal,
        calorieTarget,
        proteinTarget,
        carbTarget,
        fatTarget,
        fiberTarget,
        req.user.id
      ]
    );

    if (monthlyBudget) {
      const currentMonth = new Date().toISOString().slice(0, 7);
      await run(
        `INSERT INTO grocery_budgets (user_id, month_year, monthly_budget)
         VALUES (?, ?, ?)
         ON CONFLICT(user_id, month_year) DO UPDATE SET monthly_budget = ?`,
        [req.user.id, currentMonth, monthlyBudget, monthlyBudget]
      );
    }

    res.json({ success: true, message: 'Profile updated successfully!' });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await run('DELETE FROM users WHERE id = ?', [req.user.id]);
    res.json({ success: true, message: 'Account and associated data deleted permanently.' });
  } catch (error) {
    console.error('deleteAccount error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete account.' });
  }
};

const forgotPassword = async (req, res) => {
  return res.status(503).json({
    success: false,
    code: 'PASSWORD_RESET_NOT_CONFIGURED',
    message: 'Password reset is unavailable until a secure email delivery provider is configured.'
  });
};

const resetPassword = async (req, res) => {
  return res.status(503).json({
    success: false,
    code: 'PASSWORD_RESET_NOT_CONFIGURED',
    message: 'Password reset is unavailable until a secure email delivery provider is configured.'
  });
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
  forgotPassword,
  resetPassword
};
