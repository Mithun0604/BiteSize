const { all, get } = require('../config/database');

const getNutritionAndSpendReports = async (req, res) => {
  try {
    const userId = req.user.id;

    // Past 7 days meals
    const meals = await all(
      `SELECT logged_date, calories, protein, carbs, fat, fiber FROM meals WHERE user_id = ? ORDER BY logged_date ASC LIMIT 30`,
      [userId]
    );

    // Group meals by date
    const dailyNutritionMap = {};
    meals.forEach(m => {
      if (!dailyNutritionMap[m.logged_date]) {
        dailyNutritionMap[m.logged_date] = { date: m.logged_date, calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, mealCount: 0 };
      }
      dailyNutritionMap[m.logged_date].calories += m.calories;
      dailyNutritionMap[m.logged_date].protein += m.protein;
      dailyNutritionMap[m.logged_date].carbs += m.carbs;
      dailyNutritionMap[m.logged_date].fat += m.fat;
      dailyNutritionMap[m.logged_date].fiber += m.fiber;
      dailyNutritionMap[m.logged_date].mealCount += 1;
    });

    const nutritionTrends = Object.values(dailyNutritionMap);

    // Spending by category across all receipts
    const receipts = await all(
      'SELECT total_amount, category_summary, store_name, receipt_date FROM receipts WHERE user_id = ? ORDER BY receipt_date ASC',
      [userId]
    );

    const categorySpendTotal = {};
    receipts.forEach(r => {
      const summary = JSON.parse(r.category_summary || '{}');
      Object.entries(summary).forEach(([cat, amt]) => {
        categorySpendTotal[cat] = (categorySpendTotal[cat] || 0) + Number(amt);
      });
    });

    // Store spending
    const storeSpendTotal = {};
    receipts.forEach(r => {
      storeSpendTotal[r.store_name] = (storeSpendTotal[r.store_name] || 0) + r.total_amount;
    });

    res.json({
      success: true,
      nutritionTrends,
      categorySpendTotal,
      storeSpendTotal,
      totalSpendAllTime: receipts.reduce((acc, r) => acc + r.total_amount, 0),
      totalMealsLogged: meals.length
    });
  } catch (error) {
    console.error('getNutritionAndSpendReports error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate analytics report.' });
  }
};

/**
 * Export full personal data as JSON or CSV
 */
const exportUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const format = req.query.format || 'json';

    const user = await get('SELECT id, email, full_name, plan, created_at FROM users WHERE id = ?', [userId]);
    const profile = await get('SELECT * FROM profiles WHERE user_id = ?', [userId]);
    const meals = await all('SELECT * FROM meals WHERE user_id = ?', [userId]);
    const receipts = await all('SELECT * FROM receipts WHERE user_id = ?', [userId]);
    const pantry = await all('SELECT * FROM pantry_items WHERE user_id = ?', [userId]);

    const exportPayload = {
      user,
      profile,
      meals,
      receipts,
      pantry,
      exportedAt: new Date().toISOString()
    };

    if (format === 'csv') {
      let csv = 'Type,Date,Name,Calories,Protein,Amount\n';
      meals.forEach(m => {
        csv += `Meal,${m.logged_date},"${m.meal_name.replace(/"/g, '""')}",${m.calories},${m.protein},0\n`;
      });
      receipts.forEach(r => {
        csv += `Receipt,${r.receipt_date},"${r.store_name.replace(/"/g, '""')}",0,0,${r.total_amount}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=bitesize_data_export.csv');
      return res.send(csv);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=bitesize_data_export.json');
    res.json(exportPayload);
  } catch (error) {
    console.error('exportUserData error:', error);
    res.status(500).json({ success: false, message: 'Export failed.' });
  }
};

module.exports = {
  getNutritionAndSpendReports,
  exportUserData
};
