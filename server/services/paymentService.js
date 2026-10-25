const crypto = require('crypto');
const Razorpay = require('razorpay');
const { run, get } = require('../config/database');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const IS_SANDBOX = !(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);

const configuredPrice = (name, fallback) => {
  const configured = process.env[name];
  if (!configured || !configured.trim()) return fallback;
  const value = Number(configured);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
};

let razorpayInstance = null;
if (!IS_SANDBOX) {
  try {
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  } catch (err) {
    console.warn("Could not initialize Razorpay live instance, falling back to Sandbox mode:", err.message);
  }
}

// Plan Configurations (in INR)
const PLAN_CONFIG = {
  small_bite: {
    id: 'small_bite',
    name: 'Small Bite',
    price: 0,
    interval: 'monthly',
    receiptScanLimit: 3,
    mealScanLimit: 10,
    profilesLimit: 1,
    aiCoach: 'basic',
    whatIfTool: false,
    pantryPlate: 'basic'
  },
  big_bite: {
    id: 'big_bite',
    name: 'Big Bite',
    price: configuredPrice('BIG_BITE_PRICE_INR', 199),
    interval: 'monthly',
    receiptScanLimit: 999999, // Unlimited fair-use
    mealScanLimit: 999999,
    profilesLimit: 1,
    aiCoach: 'full',
    whatIfTool: true,
    pantryPlate: 'full'
  },
  shared_bite: {
    id: 'shared_bite',
    name: 'Shared Bite (Family)',
    price: configuredPrice('SHARED_BITE_PRICE_INR', 399),
    interval: 'monthly',
    receiptScanLimit: 999999,
    mealScanLimit: 999999,
    profilesLimit: 5,
    aiCoach: 'full',
    whatIfTool: true,
    pantryPlate: 'full',
    householdSharedBudget: true
  }
};

/**
 * Creates an Order for Razorpay checkout
 */
const createOrder = async ({ userId, planId }) => {
  const plan = PLAN_CONFIG[planId];
  if (!plan) throw new Error(`Invalid plan: ${planId}`);
  if (plan.price === 0) throw new Error("Free plan does not require checkout order");
  if (IS_SANDBOX && process.env.NODE_ENV === 'production' && process.env.ENABLE_SANDBOX_PAYMENTS !== 'true') {
    const error = new Error('Paid checkout is disabled until Razorpay credentials are configured.');
    error.statusCode = 503;
    throw error;
  }

  const amountPaise = plan.price * 100;
  const receiptId = `rcpt_${userId}_${Date.now()}`;
  let orderData;

  if (razorpayInstance && !IS_SANDBOX) {
    const options = {
      amount: amountPaise,
      currency: "INR",
      receipt: receiptId,
      notes: { userId, planId }
    };
    const order = await razorpayInstance.orders.create(options);
    orderData = {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
      isSandbox: false,
      plan,
      userId,
      planId
    };
  } else {
    const simulatedOrderId = `order_test_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    orderData = {
      orderId: simulatedOrderId,
      amount: amountPaise,
      currency: 'INR',
      keyId: null,
      isSandbox: true,
      sandboxNotice: 'TEST MODE: no payment was processed and no money was charged.',
      plan,
      userId,
      planId
    };
  }

  await run(
    `INSERT INTO payment_transactions (user_id, payment_id, order_id, amount_inr, status, plan_id, is_sandbox)
     VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
    [userId, `pending_${orderData.orderId}`, orderData.orderId, plan.price, planId, orderData.isSandbox ? 1 : 0]
  );
  return orderData;
};

/**
 * Verifies Razorpay payment signature & activates subscription
 */
const verifyPaymentAndActivate = async ({ userId, razorpayPaymentId, razorpayOrderId, razorpaySignature, planId }) => {
  const plan = PLAN_CONFIG[planId];
  if (!plan) throw new Error("Invalid plan specified");

  const pendingOrder = await get(
    `SELECT * FROM payment_transactions WHERE user_id = ? AND order_id = ? AND plan_id = ? AND status = 'pending'`,
    [userId, razorpayOrderId, planId]
  );
  if (!pendingOrder || Number(pendingOrder.amount_inr) !== Number(plan.price)) {
    throw new Error('No matching pending checkout order was found for this account.');
  }

  const isSandbox = Boolean(pendingOrder.is_sandbox);
  if (isSandbox !== IS_SANDBOX) throw new Error('Checkout mode does not match the server payment configuration.');

  if (isSandbox) {
    if (process.env.NODE_ENV === 'production' && process.env.ENABLE_SANDBOX_PAYMENTS !== 'true') {
      throw new Error('Sandbox payments are disabled in production. Configure Razorpay credentials to accept payments.');
    }
    if (!String(razorpayOrderId).startsWith('order_test_') || !String(razorpayPaymentId || '').startsWith('pay_sandbox_')) {
      throw new Error('Invalid sandbox checkout identifiers.');
    }
  } else {
    if (!razorpayInstance || !razorpayPaymentId || !razorpaySignature) throw new Error('Missing Razorpay payment verification details.');
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const expected = Buffer.from(generatedSignature, 'hex');
    const provided = Buffer.from(String(razorpaySignature), 'hex');
    if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) {
      throw new Error("Invalid payment signature verification failed!");
    }

    const [order, payment] = await Promise.all([
      razorpayInstance.orders.fetch(razorpayOrderId),
      razorpayInstance.payments.fetch(razorpayPaymentId)
    ]);
    if (order.amount !== plan.price * 100 || order.currency !== 'INR' || String(order.notes?.userId) !== String(userId) || order.notes?.planId !== planId) {
      throw new Error('The Razorpay order does not match this account or subscription plan.');
    }
    if (payment.order_id !== razorpayOrderId || payment.status !== 'captured') {
      throw new Error('Razorpay has not confirmed a captured payment for this order.');
    }
  }

  // Calculate next billing date (30 days from now)
  const nextBilling = new Date();
  nextBilling.setDate(nextBilling.getDate() + 30);
  const nextBillingStr = nextBilling.toISOString().slice(0, 10);

  const finalized = await run(
    `UPDATE payment_transactions SET payment_id = ?, status = 'success'
     WHERE id = ? AND user_id = ? AND status = 'pending'`,
    [razorpayPaymentId, pendingOrder.id, userId]
  );
  if (!finalized.changes) throw new Error('This checkout order has already been used.');

  // Update User Plan
  await run(`UPDATE users SET plan = ? WHERE id = ?`, [planId, userId]);

  // Update or insert Subscription record
  const existingSub = await get(`SELECT * FROM subscriptions WHERE user_id = ?`, [userId]);
  if (existingSub) {
    await run(
      `UPDATE subscriptions SET plan_id = ?, status = 'active', price_inr = ?, next_billing_date = ?, razorpay_sub_id = ? WHERE user_id = ?`,
      [planId, plan.price, nextBillingStr, razorpayPaymentId || 'sub_sandbox', userId]
    );
  } else {
    await run(
      `INSERT INTO subscriptions (user_id, plan_id, status, price_inr, next_billing_date, razorpay_sub_id)
       VALUES (?, ?, 'active', ?, ?, ?)`,
      [userId, planId, plan.price, nextBillingStr, razorpayPaymentId || 'sub_sandbox']
    );
  }

  return {
    success: true,
    planId,
    planName: plan.name,
    nextBillingDate: nextBillingStr,
    isSandbox,
    paymentNotice: isSandbox ? 'TEST MODE: no payment was processed.' : 'Payment verified with Razorpay.'
  };
};

/**
 * Checks if user is eligible to perform an action according to their plan limits
 */
const checkPlanLimit = async (userId, actionType) => {
  const user = await get(`SELECT plan FROM users WHERE id = ?`, [userId]);
  const planId = user ? user.plan : 'small_bite';
  const plan = PLAN_CONFIG[planId] || PLAN_CONFIG.small_bite;

  if (actionType === 'receipt_scan') {
    const count = await get(
      `SELECT COUNT(*) as cnt FROM receipts WHERE user_id = ? AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`,
      [userId]
    );
    const used = count ? count.cnt : 0;
    if (used >= plan.receiptScanLimit) {
      return {
        allowed: false,
        message: `You have reached your limit of ${plan.receiptScanLimit} receipt scans this month on the ${plan.name} plan. Upgrade to Big Bite for unlimited scans.`,
        planId,
        used,
        limit: plan.receiptScanLimit
      };
    }
    return { allowed: true, planId, used, limit: plan.receiptScanLimit };
  }

  if (actionType === 'meal_scan') {
    const count = await get(
      `SELECT COUNT(*) as cnt FROM meals WHERE user_id = ? AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`,
      [userId]
    );
    const used = count ? count.cnt : 0;
    if (used >= plan.mealScanLimit) {
      return {
        allowed: false,
        message: `You have reached your limit of ${plan.mealScanLimit} meal scans this month on ${plan.name}. Upgrade to Big Bite for unlimited meal tracking.`,
        planId,
        used,
        limit: plan.mealScanLimit
      };
    }
    return { allowed: true, planId, used, limit: plan.mealScanLimit };
  }

  return { allowed: true, planId };
};

module.exports = {
  PLAN_CONFIG,
  IS_SANDBOX,
  createOrder,
  verifyPaymentAndActivate,
  checkPlanLimit
};
