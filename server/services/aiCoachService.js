const { all, get } = require('../config/database');
const { generateGeminiContent } = require('./geminiClient');

/**
 * BiteSize AI Coach Service
 * Connects directly to the user's live database:
 * - Current pantry items
 * - Recent grocery receipts
 * - Today's and recent meal photo logs
 * - Monthly grocery budget & spending
 * - Nutritional goals and allergy restrictions
 */
const generateCoachResponse = async (userId, userMessage) => {
  // Fetch user profile and preferences
  const profile = await get('SELECT * FROM profiles WHERE user_id = ? AND is_primary = 1', [userId]) || {
    display_name: 'Friend',
    calorie_target: 2100,
    protein_target: 75,
    dietary_preference: 'vegetarian',
    allergies: '[]',
    fitness_goal: 'balanced_health'
  };

  const allergies = JSON.parse(profile.allergies || '[]');

  // Fetch recent receipts
  const receipts = await all(
    'SELECT store_name, total_amount, receipt_date FROM receipts WHERE user_id = ? ORDER BY receipt_date DESC LIMIT 5',
    [userId]
  );
  const monthKey = new Date().toISOString().slice(0, 7);
  const spendRow = await get(
    `SELECT COALESCE(SUM(total_amount), 0) AS total FROM receipts WHERE user_id = ? AND strftime('%Y-%m', receipt_date) = ?`,
    [userId, monthKey]
  );
  const totalSpend = Number(spendRow?.total || 0);

  // Fetch budget
  const currentMonth = new Date().toISOString().slice(0, 7);
  const budgetRecord = await get(
    'SELECT monthly_budget FROM grocery_budgets WHERE user_id = ? AND month_year = ?',
    [userId, currentMonth]
  );
  const monthlyBudget = budgetRecord ? budgetRecord.monthly_budget : 7500;
  const remainingBudget = monthlyBudget - totalSpend;

  // Fetch today's meals
  const today = new Date().toISOString().slice(0, 10);
  const todayMeals = await all(
    'SELECT meal_name, calories, protein, carbs, fat, fiber, is_ai_estimated FROM meals WHERE user_id = ? AND logged_date = ?',
    [userId, today]
  );

  const todayCalories = todayMeals.reduce((acc, m) => acc + m.calories, 0);
  const todayProtein = todayMeals.reduce((acc, m) => acc + m.protein, 0);

  // Fetch pantry items
  const pantryItems = await all(
    'SELECT name, category, quantity, unit, days_remaining FROM pantry_items WHERE user_id = ? ORDER BY days_remaining ASC LIMIT 8',
    [userId]
  );

  const pantryListStr = pantryItems.map(p => `${p.name} (${p.quantity} ${p.unit}, exp in ${p.days_remaining}d)`).join(', ');

  const contextSummary = {
    todayCalories: Math.round(todayCalories),
    todayProtein: Math.round(todayProtein),
    budgetRemaining: Math.round(remainingBudget),
    pantryCount: pantryItems.length
  };
  const setupReply = `AI Coach is not configured yet. Add GEMINI_API_KEY to the server environment to enable personalized coaching. Your saved records show ${Math.round(todayCalories)} kcal and ${Math.round(todayProtein)}g protein logged today, with ₹${remainingBudget.toFixed(0)} remaining in this month's grocery budget.`;
  if (!process.env.GEMINI_API_KEY) {
    return { reply: setupReply, contextSummary, providerUnavailable: true };
  }

  try {
      const systemPrompt = `You are the BiteSize AI Coach, an intelligent, encouraging, non-judgmental nutrition and grocery intelligence assistant.
User Profile:
- Name: ${profile.display_name}
- Dietary Preference: ${profile.dietary_preference}
- Allergies: ${allergies.length ? allergies.join(', ') : 'None'}
- Fitness Goal: ${profile.fitness_goal}
- Daily Calorie Target: ${profile.calorie_target} kcal
- Daily Protein Target: ${profile.protein_target}g

Current User Status:
- Today's Estimated Intake: ${Math.round(todayCalories)} kcal (Target: ${profile.calorie_target}), ${Math.round(todayProtein)}g Protein (Target: ${profile.protein_target}g)
- Grocery Budget: ₹${totalSpend.toFixed(0)} spent of ₹${monthlyBudget} (₹${remainingBudget.toFixed(0)} remaining)
- Available Pantry Items: ${pantryListStr || 'Pantry is empty'}
- Recent Supermarket Trips: ${receipts.map(r => `${r.store_name} (₹${r.total_amount})`).join(', ')}

Important Behavioral Guidelines:
1. Ground answers strictly in the user's actual pantry, meals, and budget shown above.
2. Clearly distinguish AI estimates from verified data.
3. NEVER make medical claims, prescribe treatments, or recommend extreme deficits.
4. Respect food allergies strictly (User allergies: ${allergies.join(', ') || 'None'}).
5. Keep advice practical, supportive, and cost-effective (focus on Indian market staples like dal, paneer, sprouts, oats, seasonal veggies).`;

      const reply = await generateGeminiContent({ prompt: `${systemPrompt}\n\nUser Question: ${userMessage}` });
      return {
        reply,
        contextSummary
      };
  } catch (e) {
    console.warn('Gemini AI Coach request failed:', e.message);
    return {
      reply: 'AI Coach could not reach the configured AI service. Your saved data is unchanged; please try again later.',
      contextSummary,
      providerUnavailable: true
    };
  }

  // Legacy canned coaching responses below are intentionally unreachable.
  const q = userMessage.toLowerCase();
  let reply = "";

  if (q.includes("cook") || q.includes("recipe") || q.includes("make") || q.includes("pantry")) {
    const matchedRecipes = recipeDatabase.slice(0, 2);
    reply = `Based on what is currently in your pantry (${pantryListStr}):

1. **${matchedRecipes[0].title}** (${matchedRecipes[0].nutritionPerServing.calories} kcal, ${matchedRecipes[0].nutritionPerServing.protein}g protein)
   - Uses your available ${matchedRecipes[0].requiredIngredients.map(i => i.name).join(', ')}.
   - Takes only ${matchedRecipes[0].prepTimeMinutes + matchedRecipes[0].cookTimeMinutes} mins to prepare!

2. **${matchedRecipes[1].title}** (${matchedRecipes[1].nutritionPerServing.calories} kcal, ${matchedRecipes[1].nutritionPerServing.protein}g protein)
   - Wholesome and easy on your stomach. Estimated cost: ~₹${matchedRecipes[1].estimatedCostPerServing} per serving.

*Note: You can open the "Pantry-to-Plate" tab to view complete step-by-step instructions and deduct used ingredients!*`;
  } else if (q.includes("budget") || q.includes("spent") || q.includes("cost") || q.includes("money")) {
    reply = `Here is your grocery financial breakdown for this month:
- **Total Spent So Far:** ₹${totalSpend.toFixed(2)} across ${receipts.length} recorded shopping trips.
- **Monthly Budget:** ₹${monthlyBudget.toFixed(2)}.
- **Remaining Budget:** ₹${remainingBudget.toFixed(2)} (${Math.max(0, Math.round((remainingBudget / monthlyBudget) * 100))}% left).

You are currently **on track** to stay within your monthly budget! Keep an eye on convenience quick-commerce charges to maximise your savings.`;
  } else if (q.includes("protein") || q.includes("macro") || q.includes("intake") || q.includes("target")) {
    const proteinDiff = profile.protein_target - todayProtein;
    if (proteinDiff > 0) {
      reply = `Today you have logged an estimated **${Math.round(todayProtein)}g** of protein towards your **${profile.protein_target}g** daily target (${Math.round((todayProtein / profile.protein_target) * 100)}% achieved).

To bridge the remaining **${Math.round(proteinDiff)}g** without increasing grocery spend:
1. **Roasted Makhana or Moong Sprouts:** ~7-8g protein for less than ₹25.
2. **Double Toned Curd / Dahi (150g):** ~5.5g protein and probiotic support for ~₹15.
3. **Paneer or Soya Tofu Stir-Fry:** 100g gives ~18g protein.

*(Reminder: AI estimates carry an estimated variance of ±10-12%. Always verify portion weights for exact tracking.)*`;
    } else {
      reply = `Fantastic progress today! You have reached **${Math.round(todayProtein)}g** of protein, hitting 100% of your daily goal of ${profile.protein_target}g. Your muscle protein synthesis and recovery are well supported!`;
    }
  } else if (q.includes("summary") || q.includes("today") || q.includes("calorie")) {
    reply = `Here is your nutritional snapshot for today (${today}):
- **Logged Meals:** ${todayMeals.length > 0 ? todayMeals.map(m => m.meal_name).join(', ') : 'No meals logged yet today'}
- **Total Calories:** ~${Math.round(todayCalories)} kcal of your ${profile.calorie_target} kcal target (${Math.round((todayCalories / profile.calorie_target) * 100)}%)
- **Protein Intake:** ~${Math.round(todayProtein)}g of ${profile.protein_target}g target
- **Remaining Caloric Buffer:** ~${Math.max(0, profile.calorie_target - Math.round(todayCalories))} kcal

*Disclaimer: BiteSize provides nutritional estimates for habit support and does not substitute clinical medical advice.*`;
  } else {
    reply = `Hello ${profile.display_name}! I am analyzing your real-time pantry ingredients, recent receipts from ${receipts[0]?.store_name || 'your local store'}, and your daily logs.

You have logged **${Math.round(todayCalories)} kcal** today with **₹${remainingBudget.toFixed(0)}** remaining in your monthly grocery budget.

Feel free to ask me:
- *"What can I cook with what I have right now?"*
- *"How can I get 20g more protein on a budget?"*
- *"Show my grocery spending breakdown this month"*
- *"What should I add to my shopping list for next week?"*`;
  }

  return {
    reply,
    contextSummary: {
      todayCalories: Math.round(todayCalories),
      todayProtein: Math.round(todayProtein),
      budgetRemaining: Math.round(remainingBudget),
      pantryCount: pantryItems.length
    }
  };
};

module.exports = { generateCoachResponse };
