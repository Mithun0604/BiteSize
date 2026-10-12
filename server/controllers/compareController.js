const { foodDatabase, findFoodById } = require('../data/foodDatabase');
const { run, get } = require('../config/database');

// Popular curated swaps for instant discovery
const CURATED_SWAPS = [
  {
    id: 'swap_rice_quinoa',
    title: 'White Rice vs. Quinoa',
    category: 'Grains & Carbs',
    originalFoodId: 'rice_white_cooked',
    originalServingGrams: 150,
    alternativeFoodId: 'quinoa_cooked',
    alternativeServingGrams: 150,
    goalCategory: 'High Protein & Fiber'
  },
  {
    id: 'swap_chips_makhana',
    title: 'Potato Chips vs. Roasted Makhana',
    category: 'Evening Snacks',
    originalFoodId: 'potato_chips_fried',
    originalServingGrams: 50,
    alternativeFoodId: 'roasted_makhana',
    alternativeServingGrams: 40,
    goalCategory: 'Heart Health & Weight Management'
  },
  {
    id: 'swap_paratha_roti',
    title: 'Tawa Paratha with Ghee vs. Whole Wheat Roti',
    category: 'Indian Breads',
    originalFoodId: 'paratha_plain',
    originalServingGrams: 60,
    alternativeFoodId: 'roti_chapati',
    alternativeServingGrams: 80, // 2 rotis
    goalCategory: 'Lower Fat & Saturated Fat'
  },
  {
    id: 'swap_paneer_tofu',
    title: 'Malai Paneer vs. Soya Tofu',
    category: 'Protein Sources',
    originalFoodId: 'paneer_raw',
    originalServingGrams: 100,
    alternativeFoodId: 'tofu_firm',
    alternativeServingGrams: 120,
    goalCategory: 'Lean Protein & Lower Calorie'
  },
  {
    id: 'swap_milk_almond',
    title: 'Toned Cow Milk vs. Unsweetened Almond Milk',
    category: 'Dairy & Beverages',
    originalFoodId: 'milk_cow_toned',
    originalServingGrams: 200,
    alternativeFoodId: 'almond_milk_unsweetened',
    alternativeServingGrams: 200,
    goalCategory: 'Low Calorie & Lactose Free'
  }
];

/**
 * Compare two food items, computing exact nutritional and cost trade-offs
 */
const compareFoods = async (req, res) => {
  try {
    const {
      originalFoodId,
      originalGrams = 100,
      alternativeFoodId,
      alternativeGrams = 100,
      customOriginalPrice,
      customAlternativePrice
    } = req.body;

    const foodA = findFoodById(originalFoodId);
    const foodB = findFoodById(alternativeFoodId);

    if (!foodA || !foodB) {
      return res.status(404).json({ success: false, message: 'One or both foods could not be found in the database.' });
    }

    // Factor per serving
    const factorA = originalGrams / 100;
    const factorB = alternativeGrams / 100;

    // Nutrition values
    const nutA = {
      calories: Math.round(foodA.per100g.calories * factorA),
      protein: +(foodA.per100g.protein * factorA).toFixed(1),
      carbs: +(foodA.per100g.carbs * factorA).toFixed(1),
      fat: +(foodA.per100g.fat * factorA).toFixed(1),
      fiber: +(foodA.per100g.fiber * factorA).toFixed(1),
      sugar: +(foodA.per100g.sugar * factorA).toFixed(1),
      sodium: Math.round(foodA.per100g.sodium * factorA)
    };

    const nutB = {
      calories: Math.round(foodB.per100g.calories * factorB),
      protein: +(foodB.per100g.protein * factorB).toFixed(1),
      carbs: +(foodB.per100g.carbs * factorB).toFixed(1),
      fat: +(foodB.per100g.fat * factorB).toFixed(1),
      fiber: +(foodB.per100g.fiber * factorB).toFixed(1),
      sugar: +(foodB.per100g.sugar * factorB).toFixed(1),
      sodium: Math.round(foodB.per100g.sodium * factorB)
    };

    // Cost calculations
    const costPerServingA = customOriginalPrice || +((foodA.approxCostPerKg / 1000) * originalGrams).toFixed(2);
    const costPerServingB = customAlternativePrice || +((foodB.approxCostPerKg / 1000) * alternativeGrams).toFixed(2);

    // Differences (Alternative minus Original)
    const diff = {
      calories: nutB.calories - nutA.calories,
      protein: +(nutB.protein - nutA.protein).toFixed(1),
      carbs: +(nutB.carbs - nutA.carbs).toFixed(1),
      fat: +(nutB.fat - nutA.fat).toFixed(1),
      fiber: +(nutB.fiber - nutA.fiber).toFixed(1),
      costDiff: +(costPerServingB - costPerServingA).toFixed(2)
    };

    // User profile alignment
    const profile = await get('SELECT fitness_goal, calorie_target, protein_target FROM profiles WHERE user_id = ?', [req.user.id]);
    const goal = profile ? profile.fitness_goal : 'balanced_health';

    let recommendationReason = "";
    if (diff.protein > 3) {
      recommendationReason = `Option B provides ${Math.abs(diff.protein)}g more protein per serving, strongly supporting muscle recovery.`;
    } else if (diff.calories < -50) {
      recommendationReason = `Option B saves ~${Math.abs(diff.calories)} kcal per serving without compromising satiety, ideal for calorie management.`;
    } else if (diff.fiber > 2) {
      recommendationReason = `Option B adds ${Math.abs(diff.fiber)}g of dietary fiber, supporting gut health and steady energy levels.`;
    } else {
      recommendationReason = `Both options offer balanced nutritional benefits depending on your meal context and budget.`;
    }

    if (diff.costDiff < 0) {
      recommendationReason += ` Additionally, it saves you ₹${Math.abs(diff.costDiff)} per serving!`;
    } else if (diff.costDiff > 0) {
      recommendationReason += ` It carries an estimated cost premium of ₹${diff.costDiff} per serving.`;
    }

    res.json({
      success: true,
      original: {
        id: foodA.id,
        name: foodA.name,
        category: foodA.category,
        portionGrams: originalGrams,
        costPerServing: costPerServingA,
        nutrition: nutA
      },
      alternative: {
        id: foodB.id,
        name: foodB.name,
        category: foodB.category,
        portionGrams: alternativeGrams,
        costPerServing: costPerServingB,
        nutrition: nutB
      },
      differences: diff,
      recommendationReason,
      uncertaintyNote: "Prices and nutritional values are based on standard Indian supermarket averages and IFCT/USDA composition tables. Actual brand labels may vary ±10%."
    });
  } catch (error) {
    console.error('compareFoods error:', error);
    res.status(500).json({ success: false, message: 'Comparison calculation failed.' });
  }
};

const getCuratedSwaps = (req, res) => {
  res.json({
    success: true,
    swaps: CURATED_SWAPS,
    availableFoods: foodDatabase.map(f => ({
      id: f.id,
      name: f.name,
      category: f.category,
      standardServingGrams: f.standardServingGrams,
      servingUnit: f.servingUnit,
      approxCostPerKg: f.approxCostPerKg
    }))
  });
};

/**
 * 1-Click: Add chosen alternative directly to Shopping List
 */
const addAlternativeToShoppingList = async (req, res) => {
  try {
    const { foodId, quantity = 1, unit = 'pack' } = req.body;
    const food = findFoodById(foodId);

    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found.' });
    }

    const estimatedPrice = Math.round((food.approxCostPerKg / 1000) * (food.standardServingGrams * 4)); // ~4 servings

    await run(
      `INSERT INTO shopping_list (user_id, name, category, quantity, unit, estimated_price, added_reason)
       VALUES (?, ?, ?, ?, ?, ?, 'what_if_swap')`,
      [req.user.id, food.name, food.category, quantity, unit, estimatedPrice]
    );

    res.status(201).json({
      success: true,
      message: `"${food.name}" added to your smart shopping list!`
    });
  } catch (error) {
    console.error('addAlternativeToShoppingList error:', error);
    res.status(500).json({ success: false, message: 'Failed to add alternative to shopping list.' });
  }
};

module.exports = {
  compareFoods,
  getCuratedSwaps,
  addAlternativeToShoppingList
};
