const { run, all, get } = require('../config/database');

const getHousehold = async (req, res) => {
  try {
    const user = await get('SELECT id, full_name, plan FROM users WHERE id = ?', [req.user.id]);
    const members = await all('SELECT * FROM household_members WHERE user_id = ? ORDER BY id ASC', [req.user.id]);

    // If Shared Bite, calculate shared budget stats
    const currentMonth = new Date().toISOString().slice(0, 7);
    const budget = await get('SELECT monthly_budget FROM grocery_budgets WHERE user_id = ? AND month_year = ?', [req.user.id, currentMonth]);
    const receipts = await all(
      `SELECT total_amount FROM receipts WHERE user_id = ? AND strftime('%Y-%m', receipt_date) = ?`,
      [req.user.id, currentMonth]
    );
    const totalSpend = receipts.reduce((acc, r) => acc + r.total_amount, 0);

    res.json({
      success: true,
      plan: user?.plan || 'small_bite',
      isSharedBite: user?.plan === 'shared_bite',
      members,
      sharedHouseholdBudget: {
        monthlyBudget: budget ? budget.monthly_budget : 12000,
        totalSpend,
        remaining: Math.max(0, (budget ? budget.monthly_budget : 12000) - totalSpend)
      }
    });
  } catch (error) {
    console.error('getHousehold error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve household info.' });
  }
};

const addHouseholdMember = async (req, res) => {
  try {
    const user = await get('SELECT plan FROM users WHERE id = ?', [req.user.id]);
    if (user?.plan !== 'shared_bite') {
      return res.status(403).json({
        success: false,
        message: 'Family profiles require the Shared Bite plan. Please upgrade to invite members.'
      });
    }

    const { name, email, relation, dailyCalorieTarget, dietaryPreference, allergies } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Member name is required.' });

    const result = await run(
      `INSERT INTO household_members (user_id, name, email, relation, daily_calorie_target, dietary_preference, allergies)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        name.trim(),
        email || null,
        relation || 'Family Member',
        dailyCalorieTarget || 2000,
        dietaryPreference || 'vegetarian',
        JSON.stringify(allergies || [])
      ]
    );

    res.status(201).json({
      success: true,
      message: `${name} has been added to your Shared Bite household!`,
      memberId: result.id
    });
  } catch (error) {
    console.error('addHouseholdMember error:', error);
    res.status(500).json({ success: false, message: 'Failed to add family member.' });
  }
};

const removeHouseholdMember = async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM household_members WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ success: true, message: 'Household member removed.' });
  } catch (error) {
    console.error('removeHouseholdMember error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove member.' });
  }
};

module.exports = {
  getHousehold,
  addHouseholdMember,
  removeHouseholdMember
};
