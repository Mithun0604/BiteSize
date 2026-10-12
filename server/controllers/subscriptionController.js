const { run, get, all } = require('../config/database');
const { PLAN_CONFIG, createOrder, verifyPaymentAndActivate } = require('../services/paymentService');

const getStatus = async (req, res) => {
  try {
    const user = await get('SELECT id, plan FROM users WHERE id = ?', [req.user.id]);
    const planId = user ? user.plan : 'small_bite';
    const plan = PLAN_CONFIG[planId] || PLAN_CONFIG.small_bite;

    const subscription = await get('SELECT * FROM subscriptions WHERE user_id = ?', [req.user.id]);
    const transactions = await all(
      'SELECT * FROM payment_transactions WHERE user_id = ? ORDER BY id DESC LIMIT 5',
      [req.user.id]
    );

    // Current month scan usage
    const receiptUsage = await get(
      `SELECT COUNT(*) as cnt FROM receipts WHERE user_id = ? AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`,
      [req.user.id]
    );
    const mealUsage = await get(
      `SELECT COUNT(*) as cnt FROM meals WHERE user_id = ? AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`,
      [req.user.id]
    );

    res.json({
      success: true,
      currentPlan: plan,
      subscription: subscription || {
        plan_id: 'small_bite',
        status: 'active',
        price_inr: 0,
        next_billing_date: null
      },
      usage: {
        receiptScansUsed: receiptUsage ? receiptUsage.cnt : 0,
        receiptScanLimit: plan.receiptScanLimit,
        mealScansUsed: mealUsage ? mealUsage.cnt : 0,
        mealScanLimit: plan.mealScanLimit
      },
      plans: Object.values(PLAN_CONFIG),
      recentTransactions: transactions
    });
  } catch (error) {
    console.error('getSubscriptionStatus error:', error);
    res.status(500).json({ success: false, message: 'Failed to load subscription status.' });
  }
};

const createCheckout = async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId || !PLAN_CONFIG[planId]) {
      return res.status(400).json({ success: false, message: 'Valid planId is required.' });
    }

    const orderData = await createOrder({ userId: req.user.id, planId });
    res.json({ success: true, ...orderData });
  } catch (error) {
    console.error('createCheckout error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to initiate checkout.' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, planId, isSandbox } = req.body;

    const result = await verifyPaymentAndActivate({
      userId: req.user.id,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      planId,
      isSandbox: Boolean(isSandbox)
    });

    res.json({
      success: true,
      message: `Congratulations! Your subscription has been upgraded to ${result.planName}.`,
      data: result
    });
  } catch (error) {
    console.error('verifyPayment error:', error);
    res.status(400).json({ success: false, message: error.message || 'Payment verification failed.' });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    await run(`UPDATE users SET plan = 'small_bite' WHERE id = ?`, [req.user.id]);
    await run(
      `UPDATE subscriptions SET status = 'cancelled', plan_id = 'small_bite', price_inr = 0, next_billing_date = NULL WHERE user_id = ?`,
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'Your subscription has been cancelled and reverted to Small Bite (Free).'
    });
  } catch (error) {
    console.error('cancelSubscription error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel subscription.' });
  }
};

module.exports = {
  getStatus,
  createCheckout,
  verifyPayment,
  cancelSubscription
};
