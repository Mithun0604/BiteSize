const { run, all } = require('../config/database');
const { generateCoachResponse } = require('../services/aiCoachService');

const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
    }

    // Save user message
    await run(
      'INSERT INTO coach_messages (user_id, role, message) VALUES (?, ?, ?)',
      [req.user.id, 'user', message.trim()]
    );

    // Generate AI Coach grounded response
    const coachResult = await generateCoachResponse(req.user.id, message.trim());

    // Save coach response
    await run(
      'INSERT INTO coach_messages (user_id, role, message, context_summary) VALUES (?, ?, ?, ?)',
      [req.user.id, 'assistant', coachResult.reply, JSON.stringify(coachResult.contextSummary)]
    );

    res.json({
      success: true,
      reply: coachResult.reply,
      contextSummary: coachResult.contextSummary
    });
  } catch (error) {
    console.error('Coach chat error:', error);
    res.status(500).json({ success: false, message: 'AI Coach was unable to respond. Please try again.' });
  }
};

const getHistory = async (req, res) => {
  try {
    const messages = await all(
      'SELECT id, role, message, created_at FROM coach_messages WHERE user_id = ? ORDER BY id ASC LIMIT 50',
      [req.user.id]
    );
    res.json({ success: true, messages });
  } catch (error) {
    console.error('getHistory error:', error);
    res.status(500).json({ success: false, message: 'Failed to load conversation history.' });
  }
};

const clearHistory = async (req, res) => {
  try {
    await run('DELETE FROM coach_messages WHERE user_id = ?', [req.user.id]);
    res.json({ success: true, message: 'Conversation history cleared.' });
  } catch (error) {
    console.error('clearHistory error:', error);
    res.status(500).json({ success: false, message: 'Failed to clear conversation.' });
  }
};

module.exports = {
  chat,
  getHistory,
  clearHistory
};
