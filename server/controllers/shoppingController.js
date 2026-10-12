const { run, all, get } = require('../config/database');

const getShoppingList = async (req, res) => {
  try {
    const items = await all(
      'SELECT * FROM shopping_list WHERE user_id = ? ORDER BY is_checked ASC, id DESC',
      [req.user.id]
    );

    const totalEstimatedCost = items
      .filter(i => !i.is_checked)
      .reduce((sum, item) => sum + (item.estimated_price * item.quantity), 0);

    // Group by category
    const grouped = {};
    items.forEach(item => {
      const cat = item.category || 'Other Items';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    res.json({
      success: true,
      items,
      grouped,
      totalItems: items.length,
      pendingCount: items.filter(i => !i.is_checked).length,
      totalEstimatedCost: Math.round(totalEstimatedCost)
    });
  } catch (error) {
    console.error('getShoppingList error:', error);
    res.status(500).json({ success: false, message: 'Failed to load shopping list.' });
  }
};

const addShoppingItem = async (req, res) => {
  try {
    const { name, category, quantity, unit, estimatedPrice, addedReason } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Item name is required.' });

    const result = await run(
      `INSERT INTO shopping_list (user_id, name, category, quantity, unit, estimated_price, added_reason)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        name.trim(),
        category || 'Pantry & Essentials',
        quantity || 1,
        unit || 'pack',
        estimatedPrice || 60,
        addedReason || 'manual'
      ]
    );

    res.status(201).json({ success: true, message: 'Item added to shopping list.', id: result.id });
  } catch (error) {
    console.error('addShoppingItem error:', error);
    res.status(500).json({ success: false, message: 'Failed to add item.' });
  }
};

const toggleItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await get('SELECT is_checked FROM shopping_list WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    const newChecked = item.is_checked ? 0 : 1;
    await run('UPDATE shopping_list SET is_checked = ? WHERE id = ?', [newChecked, id]);

    res.json({ success: true, isChecked: newChecked });
  } catch (error) {
    console.error('toggleItem error:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle item.' });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, unit, estimatedPrice } = req.body;

    await run(
      `UPDATE shopping_list SET
        quantity = COALESCE(?, quantity),
        unit = COALESCE(?, unit),
        estimated_price = COALESCE(?, estimated_price)
       WHERE id = ? AND user_id = ?`,
      [quantity, unit, estimatedPrice, id, req.user.id]
    );

    res.json({ success: true, message: 'Shopping list item updated.' });
  } catch (error) {
    console.error('updateItem error:', error);
    res.status(500).json({ success: false, message: 'Failed to update item.' });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM shopping_list WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ success: true, message: 'Item removed from shopping list.' });
  } catch (error) {
    console.error('deleteItem error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete item.' });
  }
};

const clearChecked = async (req, res) => {
  try {
    await run('DELETE FROM shopping_list WHERE user_id = ? AND is_checked = 1', [req.user.id]);
    res.json({ success: true, message: 'Cleared completed items.' });
  } catch (error) {
    console.error('clearChecked error:', error);
    res.status(500).json({ success: false, message: 'Failed to clear completed items.' });
  }
};

module.exports = {
  getShoppingList,
  addShoppingItem,
  toggleItem,
  updateItem,
  deleteItem,
  clearChecked
};
