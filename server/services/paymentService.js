const crypto = require('crypto');
const Razorpay = require('razorpay');
const { run, get } = require('../config/database');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_BiteSizeSandboxKey101';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'bitesize_sandbox_secret_key_2026';
const IS_SANDBOX = !process.env.RAZORPAY_KEY_ID;

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
    price: 199,
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
    price: 399,
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

  const amountPaise = plan.price * 100;
  const receiptId = `rcpt_${userId}_${Date.now()}`;

  if (razorpayInstance && !IS_SANDBOX) {
    const options = {
      amount: amountPaise,
      currency: "INR",
      receipt: receiptId,
      notes: { userId, planId }
    };
    const order = await razorpayInstance.orders.create(options);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
      isSandbox: false,
      plan
    };
  }

  // Realistic Sandbox Mode Order
  const simulatedOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    orderId: simulatedOrderId,
    amount: amountPaise,
    currency: "INR",
    keyId: RAZORPAY_KEY_ID,
    isSandbox: true,
    sandboxNotice: "Operating in BiteSize Verified Test Sandbox. No real money will be charged.",
    plan
  };
};

/**
 * Verifies Razorpay payment signature & activates subscription
 */
const verifyPaymentAndActivate = async ({ userId, razorpayPaymentId, razorpayOrderId, razorpaySignature, planId, isSandbox = false }) => {
  const plan = PLAN_CONFIG[planId];
  if (!plan) throw new Error("Invalid plan specified");

  if (!isSandbox && razorpayInstance) {
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      throw new Error("Invalid payment signature verification failed!");
    }
  }

  // Calculate next billing date (30 days from now)
  const nextBilling = new Date();
  nextBilling.setDate(nextBilling.getDate() + 30);
  const nextBillingStr = nextBilling.toISOString().slice(0, 10);

  // Record transaction in database
  await run(
    `INSERT INTO payment_transactions (user_id, payment_id, order_id, amount_inr, status, plan_id, is_sandbox)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, razorpayPaymentId || `pay_sim_${Date.now()}`, razorpayOrderId, plan.price, 'success', planId, isSandbox ? 1 : 0]
  );

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
    isSandbox
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
  createOrder,
  verifyPaymentAndActivate,
  checkPlanLimit
};
