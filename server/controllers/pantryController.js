const { run, get, all } = require('../config/database');
const { recipeDatabase } = require('../data/recipeDatabase');

const getPantry = async (req, res) => {
  try {
    const items = await all(
      'SELECT * FROM pantry_items WHERE user_id = ? ORDER BY days_remaining ASC, id DESC',
      [req.user.id]
    );

    // Identify expiring soon items (< 4 days)
    const expiringSoon = items.filter(i => i.days_remaining <= 3);

    res.json({
      success: true,
      items,
      totalCount: items.length,
      expiringSoonCount: expiringSoon.length,
      expiringSoon
    });
  } catch (error) {
    console.error('getPantry error:', error);
    res.status(500).json({ success: false, message: 'Failed to load pantry.' });
  }
};

const addPantryItem = async (req, res) => {
  try {
    const { name, category, quantity, unit, daysRemaining } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Item name is required.' });

    const result = await run(
      `INSERT INTO pantry_items (user_id, name, category, quantity, unit, days_remaining)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, name.trim(), category || 'Pantry & Essentials', quantity || 1, unit || 'pack', daysRemaining || 14]
    );

    res.status(201).json({ success: true, message: 'Pantry item added.', id: result.id });
  } catch (error) {
    console.error('addPantryItem error:', error);
    res.status(500).json({ success: false, message: 'Failed to add pantry item.' });
  }
};

const updatePantryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, unit, daysRemaining, isLow } = req.body;

    await run(
      `UPDATE pantry_items SET
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        quantity = COALESCE(?, quantity),
        unit = COALESCE(?, unit),
        days_remaining = COALESCE(?, days_remaining),
        is_low = COALESCE(?, is_low)
       WHERE id = ? AND user_id = ?`,
      [name, category, quantity, unit, daysRemaining, isLow, id, req.user.id]
    );

    res.json({ success: true, message: 'Pantry item updated.' });
  } catch (error) {
    console.error('updatePantryItem error:', error);
    res.status(500).json({ success: false, message: 'Failed to update pantry item.' });
  }
};

const deletePantryItem = async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM pantry_items WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ success: true, message: 'Pantry item removed.' });
  } catch (error) {
    console.error('deletePantryItem error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete pantry item.' });
  }
};

/**
 * Pantry-to-Plate AI: Match available pantry items to recipes
 */
const getRecipeSuggestions = async (req, res) => {
  try {
    const pantryItems = await all('SELECT name, category FROM pantry_items WHERE user_id = ?', [req.user.id]);
    const pantryNames = pantryItems.map(p => p.name.toLowerCase());

    const suggestions = recipeDatabase.map(recipe => {
      let matchingCount = 0;
      const ingredientsStatus = recipe.requiredIngredients.map(ing => {
        const inPantry = pantryNames.some(p => p.includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(p));
        if (inPantry) matchingCount++;
        return {
          ...ing,
          availableInPantry: inPantry
        };
      });

      const matchPercentage = Math.round((matchingCount / recipe.requiredIngredients.length) * 100);

      return {
        ...recipe,
        ingredientsStatus,
        matchPercentage,
        missingCount: recipe.requiredIngredients.length - matchingCount
      };
    });

    // Sort by highest pantry ingredient match first
    suggestions.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({ success: true, recipes: suggestions });
  } catch (error) {
    console.error('getRecipeSuggestions error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate recipe suggestions.' });
  }
};

/**
 * Mark pantry ingredients as used after cooking a meal
 */
const cookRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const recipe = recipeDatabase.find(r => r.id === recipeId);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found.' });

    // Deduct pantry items or reduce quantity
    for (const ing of recipe.requiredIngredients) {
      await run(
        `UPDATE pantry_items SET quantity = MAX(0, quantity - 0.5)
         WHERE user_id = ? AND LOWER(name) LIKE ?`,
        [req.user.id, `%${ing.name.toLowerCase().slice(0, 5)}%`]
      );
    }

    res.json({
      success: true,
      message: `Delicious! "${recipe.title}" cooked — pantry inventory updated.`
    });
  } catch (error) {
    console.error('cookRecipe error:', error);
    res.status(500).json({ success: false, message: 'Failed to record cooked recipe.' });
  }
};

/**
 * Add all missing ingredients of a recipe directly to the Shopping List
 */
const addMissingToShoppingList = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const recipe = recipeDatabase.find(r => r.id === recipeId);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found.' });

    const pantryItems = await all('SELECT name FROM pantry_items WHERE user_id = ?', [req.user.id]);
    const pantryNames = pantryItems.map(p => p.name.toLowerCase());

    let addedCount = 0;
    for (const ing of recipe.requiredIngredients) {
      const inPantry = pantryNames.some(p => p.includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(p));
      if (!inPantry) {
        await run(
          `INSERT INTO shopping_list (user_id, name, category, quantity, unit, estimated_price, added_reason)
           VALUES (?, ?, ?, 1, ?, 65, 'recipe_ingredient')`,
          [req.user.id, ing.name, ing.category || 'Pantry & Essentials', ing.quantity]
        );
        addedCount++;
      }
    }

    res.json({
      success: true,
      message: `${addedCount} missing ingredient(s) added to your smart shopping list!`
    });
  } catch (error) {
    console.error('addMissingToShoppingList error:', error);
    res.status(500).json({ success: false, message: 'Failed to transfer ingredients to shopping list.' });
  }
};

module.exports = {
  getPantry,
  addPantryItem,
  updatePantryItem,
  deletePantryItem,
  getRecipeSuggestions,
  cookRecipe,
  addMissingToShoppingList
};
