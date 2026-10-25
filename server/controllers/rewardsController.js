const { run, get, all } = require('../config/database');

// First Club Partner Voucher Catalog (Healthy & Trusted Groceries)
const FIRST_CLUB_CATALOG = [
  {
    id: 'fc_vouch_100',
    title: '₹100 First Club Grocery Voucher',
    partner: 'First Club Organics',
    requiredCurrency: 100,
    minSpend: 500,
    description: 'Valid on cold-pressed cooking oils, unpolished dals, and whole grains.',
    category: 'Voucher'
  },
  {
    id: 'fc_vouch_250',
    title: '₹250 First Club Nutrition Credit',
    partner: 'First Club Fresh',
    requiredCurrency: 250,
    minSpend: 999,
    description: 'Valid on farm-fresh organic vegetable crates and berries.',
    category: 'Voucher'
  },
  {
    id: 'fc_vouch_500',
    title: '₹500 Premium Wellness Basket Credit',
    partner: 'First Club Gourmet',
    requiredCurrency: 450,
    minSpend: 1500,
    description: 'Valid across entire First Club healthy pantry inventory.',
    category: 'Voucher'
  }
];

const getRewardsStatus = async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);

    // Current month reward record
    let currentReward = await get(
      'SELECT * FROM bite_currency_rewards WHERE user_id = ? AND month_year = ?',
      [req.user.id, currentMonth]
    );

    if (!currentReward) {
      // Calculate eligible spend from receipts
      const receipts = await all(
        `SELECT total_amount FROM receipts WHERE user_id = ? AND strftime('%Y-%m', receipt_date) = ?`,
        [req.user.id, currentMonth]
      );
      const totalSpend = receipts.reduce((acc, r) => acc + r.total_amount, 0);
      const ins = await run(
        `INSERT INTO bite_currency_rewards (user_id, month_year, eligible_grocery_spend, reward_percentage, currency_amount, status)
         VALUES (?, ?, ?, 7.5, 0, 'in_progress')`,
        [req.user.id, currentMonth, totalSpend]
      );
      currentReward = await get('SELECT * FROM bite_currency_rewards WHERE id = ?', [ins.id]);
    }

    // Monthly goals
    const goals = await all(
      'SELECT * FROM monthly_goals WHERE user_id = ? AND month_year = ? ORDER BY id ASC',
      [req.user.id, currentMonth]
    );

    // Past rewards
    const pastRewards = await all(
      'SELECT * FROM bite_currency_rewards WHERE user_id = ? AND month_year != ? ORDER BY id DESC',
      [req.user.id, currentMonth]
    );

    // Calculate goals achieved ratio
    const achievedCount = goals.filter(g => g.is_achieved || (g.current_value >= g.target_value)).length;
    const isEligibleForRedemption = goals.length > 0 && achievedCount >= Math.ceil(goals.length / 2);
    const eligibleSpend = Number(currentReward?.eligible_grocery_spend || 0);
    const earnedCurrency = isEligibleForRedemption ? +(eligibleSpend * 0.075).toFixed(2) : 0;
    await run(
      `UPDATE bite_currency_rewards SET currency_amount = ?, status = ? WHERE id = ?`,
      [earnedCurrency, isEligibleForRedemption ? 'eligible' : 'in_progress', currentReward.id]
    );
    currentReward = await get('SELECT * FROM bite_currency_rewards WHERE id = ?', [currentReward.id]);

    res.json({
      success: true,
      currentMonth,
      currentReward,
      goals,
      goalsProgress: {
        total: goals.length,
        achieved: achievedCount,
        percent: goals.length > 0 ? Math.round((achievedCount / goals.length) * 100) : 0,
        isEligibleForRedemption
      },
      partnerProgram: {
        partnerName: 'First Club',
        status: 'Demo only; no First Club integration',
        disclaimer: 'Rewards are illustrative. The 7.5% amount is shown only after the configured monthly goals are met. Voucher codes are previews and cannot be redeemed with First Club.'
      },
      catalog: FIRST_CLUB_CATALOG,
      pastRewards
    });
  } catch (error) {
    console.error('getRewardsStatus error:', error);
    res.status(500).json({ success: false, message: 'Failed to load rewards.' });
  }
};

const redeemVoucher = async (req, res) => {
  try {
    const { voucherId } = req.body;
    const voucher = FIRST_CLUB_CATALOG.find(v => v.id === voucherId);
    if (!voucher) return res.status(404).json({ success: false, message: 'Voucher not found.' });

    const currentMonth = new Date().toISOString().slice(0, 7);
    const reward = await get(
      'SELECT * FROM bite_currency_rewards WHERE user_id = ? AND month_year = ?',
      [req.user.id, currentMonth]
    );

    const goals = await all(
      'SELECT target_value, current_value, is_achieved FROM monthly_goals WHERE user_id = ? AND month_year = ?',
      [req.user.id, currentMonth]
    );
    const achievedGoals = goals.filter(goal => goal.is_achieved || goal.current_value >= goal.target_value).length;
    const eligible = goals.length > 0 && achievedGoals >= Math.ceil(goals.length / 2);
    if (!eligible) {
      return res.status(400).json({ success: false, message: 'Meet at least half of this month’s goals before previewing a reward code.' });
    }

    if (!reward || reward.currency_amount < voucher.requiredCurrency) {
      return res.status(400).json({
        success: false,
        message: `Insufficient Bite Currency. You need ${voucher.requiredCurrency} Bite Currency to redeem this voucher.`
      });
    }

    const code = `DEMO-PREVIEW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const remaining = reward.currency_amount;

    res.json({
      success: true,
      message: `Demo preview only. This code is not redeemable with First Club.`,
      voucherCode: code,
      voucher,
      remainingCurrency: remaining,
      isSimulated: true
    });
  } catch (error) {
    console.error('redeemVoucher error:', error);
    res.status(500).json({ success: false, message: 'Voucher redemption failed.' });
  }
};

module.exports = {
  getRewardsStatus,
  redeemVoucher
};
