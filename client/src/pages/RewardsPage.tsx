import React, { useState, useEffect } from 'react';
import { rewardsApi } from '../services/api';
import confetti from 'canvas-confetti';
import {
  Coins,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Gift,
  Tag,
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';

interface RewardsProps {
  onNavigate: (page: string) => void;
}

export const RewardsPage: React.FC<RewardsProps> = ({ onNavigate }) => {
  const [rewardsData, setRewardsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [redeemedVoucher, setRedeemedVoucher] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const res = await rewardsApi.getStatus();
      if (res.success) {
        setRewardsData(res);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not load rewards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleRedeem = async (voucherId: string) => {
    setErrorMessage(null);
    try {
      const res = await rewardsApi.redeemVoucher(voucherId);
      if (res.success) {
        setRedeemedCode(res.voucherCode);
        setRedeemedVoucher(res.voucher);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        fetchRewards();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Redemption failed.');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-[#5B6B7A]">Loading rewards and goal progress...</div>;
  }

  const { currentReward, goals, goalsProgress, catalog, partnerProgram } = rewardsData || {};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="section-eyebrow">
          <Coins className="w-3.5 h-3.5" />
          <span>Bite Currency Rewards Programme</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white">
          Bite Currency & Partner Rewards
        </h1>
        <p className="text-xs text-[#5B6B7A] dark:text-slate-400 max-w-2xl leading-relaxed">
          Meet this month’s goals to see an illustrative <strong>7.5% reward estimate</strong>. First Club is not integrated; preview codes cannot be redeemed and do not spend your balance.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-xs text-[#D96B6B] flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Redeemed Success Modal / Card */}
      {redeemedCode && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FAF8F4] to-[#F6D6C9]/40 border-2 border-[#D4A85A] shadow-lg space-y-3 animate-fade-in">
          <div className="flex items-center space-x-2 text-[#2E7D6B] font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Demo preview code generated</span>
          </div>
          <p className="text-xs text-[#2E2E2E]">
            This non-redeemable preview is for <strong>{redeemedVoucher?.title}</strong>:
          </p>
          <div className="inline-block px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border-2 border-dashed border-[#D4A85A] font-mono text-base font-black text-[#C75A3B] tracking-wider select-all">
            {redeemedCode}
          </div>
          <p className="text-[11px] text-[#5B6B7A]">
            First Club is not connected. This code will not work at checkout; your Bite Currency balance was not changed.
          </p>
        </div>
      )}

      {/* Top Balance & Calculation Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Balance Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-white to-[#FAF8F4] dark:from-slate-800 dark:to-slate-900 p-6 sm:p-8 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A85A]">
              Potential Demo Reward
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl sm:text-5xl font-black text-[#2E2E2E] dark:text-white">
                ₹{currentReward?.currency_amount ? Math.round(currentReward.currency_amount) : 0}
              </span>
              <span className="text-xs text-[#5B6B7A]">Bite Currency</span>
            </div>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
              {goalsProgress?.isEligibleForRedemption ? 'Illustrative 7.5% of saved receipt spend after goals are met.' : 'No reward is earned until the monthly goal threshold is met.'} Receipt spend: ₹{currentReward?.eligible_grocery_spend?.toLocaleString('en-IN') || 0}.
            </p>
          </div>

          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#D4A85A] to-[#F6E3B7] flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-[#D4A85A]/25 shrink-0">
            ₹
          </div>
        </div>

        {/* Goal Qualification Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6B7A] dark:text-slate-400">
            Monthly Qualification
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-[#2E2E2E] dark:text-white">
              {goalsProgress?.percent || 0}%
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              goalsProgress?.isEligibleForRedemption
                ? 'bg-[#2E7D6B]/10 text-[#2E7D6B]'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {goalsProgress?.isEligibleForRedemption ? 'Eligible to Redeem' : 'In Progress'}
            </span>
          </div>

          <div className="w-full bg-[#E8E6E1] dark:bg-slate-700 h-2 ui-progress-track overflow-hidden">
            <div
              className="bg-[#2E7D6B] h-full ui-progress-fill transition-all"
              style={{ width: `${goalsProgress?.percent || 0}%` }}
            ></div>
          </div>

          <p className="text-[11px] text-[#5B6B7A] dark:text-slate-400 leading-snug">
            {goalsProgress?.achieved} of {goalsProgress?.total} goals completed. Maintain realistic nutrition and budgeting habits to activate redemptions.
          </p>
        </div>
      </div>

      {/* Monthly Goals Progress Tracker */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
        <h3 className="font-serif text-xl font-bold text-[#2E2E2E] dark:text-white">
          Active Monthly Goals
        </h3>

        <div className="space-y-3">
          {goals?.map((goal: any) => {
            const isDone = goal.is_achieved || goal.current_value >= goal.target_value;
            const pct = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));

            return (
              <div
                key={goal.id}
                className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#2E2E2E] dark:text-white">{goal.goal_title}</span>
                    {isDone && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#2E7D6B]/15 text-[#2E7D6B]">
                        Achieved
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#5B6B7A] dark:text-slate-400">
                    Current progress: {goal.current_value} / {goal.target_value} {goal.unit}
                  </p>
                </div>

                <div className="w-full sm:w-44">
                  <div className="flex justify-between text-[10px] text-[#5B6B7A] mb-1">
                    <span>Progress</span>
                    <span className="font-bold">{pct}%</span>
                  </div>
                  <div className="w-full bg-[#E8E6E1] dark:bg-slate-600 h-1.5 ui-progress-track overflow-hidden">
                    <div className="bg-[#C75A3B] h-full ui-progress-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* First Club Partner Voucher Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2E2E2E] dark:text-white flex items-center space-x-2">
              <Gift className="w-5 h-5 text-[#D4A85A]" />
              <span>Preview First Club Rewards</span>
            </h3>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
              Demo catalog only. No partner redemption service is connected.
            </p>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-stone-200 dark:bg-slate-700 text-stone-700 dark:text-stone-300 font-semibold">
            Partner Pilot Mode
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {catalog?.map((item: any) => {
            const canAfford = currentReward && currentReward.currency_amount >= item.requiredCurrency;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#5B6B7A] uppercase">{item.partner}</span>
                    <Tag className="w-4 h-4 text-[#D4A85A]" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">{item.title}</h4>
                  <p className="text-xs text-[#5B6B7A] dark:text-slate-400 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-[#E8E6E1] dark:border-slate-700 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-black text-[#D4A85A] text-sm">₹{item.requiredCurrency}</span>
                    <span className="text-[#5B6B7A] block text-[10px]">Bite Currency</span>
                  </div>

                  <button
                    onClick={() => handleRedeem(item.id)}
                    disabled={!canAfford}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C75A3B] text-white hover:bg-[#b0482b] disabled:opacity-40 transition-transform hover:scale-105"
                  >
                    {canAfford ? 'Generate demo code' : 'Need More Currency'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
