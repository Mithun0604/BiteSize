const { get, all } = require('../config/database');
const { recipeDatabase } = require('../data/recipeDatabase');

const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);
    const currentMonth = today.slice(0, 7);

    // 1. User & Profile
    const user = await get('SELECT id, full_name, plan FROM users WHERE id = ?', [userId]);
    const profile = await get('SELECT * FROM profiles WHERE user_id = ? AND is_primary = 1', [userId]) || {
      display_name: user?.full_name?.split(' ')[0] || 'Friend',
      calorie_target: 2100,
      protein_target: 75,
      carb_target: 250,
      fat_target: 60,
      fiber_target: 30,
      fitness_goal: 'balanced_health'
    };

    // 2. Today's Meals & Macros
    const todayMeals = await all(
      'SELECT id, meal_name, meal_type, image_path, portion_grams, calories, protein, carbs, fat, fiber, uncertainty_range, logged_date FROM meals WHERE user_id = ? AND logged_date = ? ORDER BY id DESC',
      [userId, today]
    );

    const nutritionTotals = todayMeals.reduce(
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

    // 3. Grocery Budget & Spending
    const budgetRecord = await get(
      'SELECT monthly_budget, alert_threshold_percent FROM grocery_budgets WHERE user_id = ? AND month_year = ?',
      [userId, currentMonth]
    );
    const monthlyBudget = budgetRecord ? budgetRecord.monthly_budget : 7500;

    const receiptsThisMonth = await all(
      `SELECT total_amount FROM receipts WHERE user_id = ? AND strftime('%Y-%m', receipt_date) = ?`,
      [userId, currentMonth]
    );
    const currentMonthSpent = receiptsThisMonth.reduce((acc, r) => acc + r.total_amount, 0);

    // 4. Recent Receipts
    const recentReceipts = await all(
      'SELECT id, store_name, receipt_date, total_amount, items_count, category_summary, image_path FROM receipts WHERE user_id = ? ORDER BY receipt_date DESC LIMIT 4',
      [userId]
    );

    const parsedReceipts = recentReceipts.map(r => ({
      ...r,
      categorySummary: JSON.parse(r.category_summary || '{}')
    }));

    // 5. Goals & Rewards
    const goals = await all(
      'SELECT * FROM monthly_goals WHERE user_id = ? AND month_year = ?',
      [userId, currentMonth]
    );
    const achievedGoals = goals.filter(g => g.is_achieved || g.current_value >= g.target_value).length;
    const goalCompletionRate = goals.length > 0 ? Math.round((achievedGoals / goals.length) * 100) : 75;

    const rewardRecord = await get(
      'SELECT currency_amount, eligible_grocery_spend, status FROM bite_currency_rewards WHERE user_id = ? AND month_year = ?',
      [userId, currentMonth]
    );

    // 6. Pantry Items and Top Recipe Suggestion
    const pantryCount = await get('SELECT COUNT(*) as cnt FROM pantry_items WHERE user_id = ?', [userId]);
    const expiringPantry = await all(
      'SELECT name, days_remaining FROM pantry_items WHERE user_id = ? AND days_remaining <= 3 ORDER BY days_remaining ASC LIMIT 3',
      [userId]
    );

    const suggestedMeal = recipeDatabase[0];

    // 7. Dynamic AI Health & Budget Insights
    const insights = [];
    if (nutritionTotals.protein < profile.protein_target * 0.5) {
      insights.push({
        type: 'nutrition',
        tag: 'Protein Check',
        title: 'Afternoon Protein Opportunity',
        message: `You've logged ${Math.round(nutritionTotals.protein)}g of protein today. Consider pairing your dinner with paneer or moong sprouts to reach your ${profile.protein_target}g goal.`
      });
    } else {
      insights.push({
        type: 'nutrition',
        tag: 'Macro On Track',
        title: 'Solid Protein Consistency',
        message: `Great balance today! You're at ${Math.round((nutritionTotals.protein / profile.protein_target) * 100)}% of your daily protein target.`
      });
    }

    const budgetPercent = Math.round((currentMonthSpent / monthlyBudget) * 100);
    if (budgetPercent > 70) {
      insights.push({
        type: 'budget',
        tag: 'Smart Spending',
        title: 'Budget Alert Threshold',
        message: `You have utilized ${budgetPercent}% of your ₹${monthlyBudget} monthly grocery budget with ${Math.max(0, Math.round(monthlyBudget - currentMonthSpent))} remaining.`
      });
    } else {
      insights.push({
        type: 'budget',
        tag: 'Spend Smart',
        title: 'Budget Comfort Zone',
        message: `You have spent ₹${currentMonthSpent.toFixed(0)} of ₹${monthlyBudget} (${100 - budgetPercent}% buffer remaining). Well paced for the month!`
      });
    }

    if (expiringPantry.length > 0) {
      insights.push({
        type: 'waste',
        tag: 'Zero Food Waste',
        title: 'Expiring Ingredients Alert',
        message: `Your ${expiringPantry.map(p => p.name).join(', ')} expires in ${expiringPantry[0].days_remaining} day(s). Cook "${suggestedMeal.title}" tonight to minimize waste!`
      });
    }

    res.json({
      success: true,
      user: {
        id: user?.id,
        name: user?.full_name,
        plan: user?.plan
      },
      profile,
      todayMacros: {
        calories: Math.round(nutritionTotals.calories),
        calorieTarget: profile.calorie_target,
        calorieProgress: Math.min(100, Math.round((nutritionTotals.calories / profile.calorie_target) * 100)),
        protein: +nutritionTotals.protein.toFixed(1),
        proteinTarget: profile.protein_target,
        proteinProgress: Math.min(100, Math.round((nutritionTotals.protein / profile.protein_target) * 100)),
        carbs: +nutritionTotals.carbs.toFixed(1),
        carbTarget: profile.carb_target,
        carbProgress: Math.min(100, Math.round((nutritionTotals.carbs / profile.carb_target) * 100)),
        fat: +nutritionTotals.fat.toFixed(1),
        fatTarget: profile.fat_target,
        fatProgress: Math.min(100, Math.round((nutritionTotals.fat / profile.fat_target) * 100)),
        fiber: +nutritionTotals.fiber.toFixed(1),
        fiberTarget: profile.fiber_target,
        fiberProgress: Math.min(100, Math.round((nutritionTotals.fiber / profile.fiber_target) * 100))
      },
      budgetOverview: {
        monthlyBudget,
        currentSpent: currentMonthSpent,
        remaining: Math.max(0, monthlyBudget - currentMonthSpent),
        percentUsed: Math.min(100, Math.round((currentMonthSpent / monthlyBudget) * 100))
      },
      todayMeals,
      recentReceipts: parsedReceipts,
      pantryStats: {
        totalItems: pantryCount ? pantryCount.cnt : 0,
        expiringSoon: expiringPantry
      },
      goalsSummary: {
        completionRate: goalCompletionRate,
        achievedCount: achievedGoals,
        totalCount: goals.length,
        biteCurrencyBalance: rewardRecord ? rewardRecord.currency_amount : 0
      },
      insights,
      suggestedMeal
    });
  } catch (error) {
    console.error('getDashboardOverview error:', error);
    res.status(500).json({ success: false, message: 'Failed to assemble dashboard overview.' });
  }
};

module.exports = { getDashboardOverview };
