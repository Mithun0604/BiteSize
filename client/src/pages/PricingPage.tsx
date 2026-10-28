import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { subApi } from '../services/api';
import { openRazorpayCheckout } from '../services/razorpayCheckout';
import {
  Check,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  Users,
  Camera,
  Receipt,
  HeartHandshake,
  ArrowRight,
  Zap
} from 'lucide-react';

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    subApi.getPlans().then((response: any) => setPlans(response.plans || [])).catch(() => setPlans([]));
  }, []);

  const priceFor = (planId: string) => plans.find(plan => plan.id === planId)?.price;

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      onNavigate('login');
      return;
    }

    if (planId === 'small_bite') {
      alert("You are already on the Small Bite free tier.");
      return;
    }

    setLoadingPlan(planId);
    try {
      const res = await subApi.createCheckout(planId);
      if (res.success) {
        if (res.isSandbox) {
          await subApi.verifyPayment({
            razorpayPaymentId: `pay_sandbox_${Date.now()}`,
            razorpayOrderId: res.orderId,
            razorpaySignature: '',
            planId
          });
          alert(`TEST MODE: no payment was processed. ${planId === 'big_bite' ? 'Big Bite' : 'Shared Bite'} test access is now active.`);
        } else {
          const payment = await openRazorpayCheckout(res);
          if (!payment) return;
          await subApi.verifyPayment({
            razorpayPaymentId: payment.razorpay_payment_id,
            razorpayOrderId: payment.razorpay_order_id,
            razorpaySignature: payment.razorpay_signature,
            planId
          });
          alert(`Payment verified. ${planId === 'big_bite' ? 'Big Bite' : 'Shared Bite'} is active.`);
        }
        window.location.reload();
      }
    } catch (err: any) {
      alert(err.message || 'Payment initiation failed.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="section-eyebrow">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple, Honest Pricing</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2E2E2E] dark:text-white">
          Invest in Your Health. Save on Your Groceries.
        </h1>
        <p className="text-sm text-[#5B6B7A] dark:text-slate-400">
          Start free with meal photo suggestions or unlock more meal and receipt tools, coaching, and family sharing.
        </p>

        <p className="text-xs text-[#5B6B7A] dark:text-slate-400 pt-2">Monthly plans. Prices are supplied by the server.</p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        
        {/* Tier 1: Small Bite */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-[#E8E6E1] dark:border-slate-700 shadow-soft flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-stone-100 dark:bg-slate-700 text-[#5B6B7A] text-[11px] font-bold">
              Starter
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white">
              Small Bite
            </h3>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
              Essential meal and grocery tracking for health-conscious individuals.
            </p>

            <div className="pt-2">
              <span className="font-serif text-4xl font-extrabold text-[#2E2E2E] dark:text-white">
                ₹0
              </span>
              <span className="text-xs text-[#5B6B7A] dark:text-slate-400"> / forever free</span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#2E2E2E] dark:text-slate-300 pt-4 border-t border-[#E8E6E1] dark:border-slate-700">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2E7D6B] shrink-0" />
                <span>10 meal photo scans per month</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2E7D6B] shrink-0" />
                <span>3 grocery receipt scans per month</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2E7D6B] shrink-0" />
                <span>Daily calorie & macro targets</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2E7D6B] shrink-0" />
                <span>Verified IFCT nutrition database</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2E7D6B] shrink-0" />
                <span>Standard Pantry & Shopping List</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate(user ? 'dashboard' : 'register')}
            className="w-full py-3 rounded-xl font-bold text-xs bg-stone-100 dark:bg-slate-700 text-[#2E2E2E] dark:text-white hover:bg-stone-200 transition-colors"
          >
            {user?.plan === 'small_bite' ? 'Current Active Plan' : 'Get Started Free'}
          </button>
        </div>

        {/* Tier 2: Big Bite (Featured) */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-[#C75A3B] shadow-2xl relative flex flex-col justify-between space-y-6">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C75A3B] text-white text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
            Most Popular
          </div>

          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-[#C75A3B]/10 text-[#C75A3B] text-[11px] font-bold">
              Full Intelligence
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white">
              Big Bite
            </h3>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
              For dedicated health champions who want unlimited AI insights and rewards.
            </p>

            <div className="pt-2">
              <span className="font-serif text-4xl font-extrabold text-[#C75A3B]">
                {priceFor('big_bite') == null ? '—' : `₹${Number(priceFor('big_bite')).toLocaleString('en-IN')}`}
              </span>
              <span className="text-xs text-[#5B6B7A] dark:text-slate-400">
                {' / month'}
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#2E2E2E] dark:text-slate-300 pt-4 border-t border-[#E8E6E1] dark:border-slate-700">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#C75A3B] shrink-0" />
                <span className="font-bold">Unlimited meal photo scans</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#C75A3B] shrink-0" />
                <span className="font-bold">Unlimited receipt OCR scans</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#C75A3B] shrink-0" />
                <span>24/7 AI Nutrition & Grocery Coach</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#C75A3B] shrink-0" />
                <span>Pantry-to-Plate smart recipe suggestions</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#C75A3B] shrink-0" />
                <span>"What If I Changed This?" cost simulator</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#C75A3B] shrink-0" />
                <span>Earn 7.5% Bite Currency on healthy purchases</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('big_bite')}
            disabled={loadingPlan === 'big_bite'}
            className="w-full py-3.5 rounded-xl font-bold text-xs bg-[#C75A3B] text-white hover:bg-[#b0482b] shadow-lg shadow-[#C75A3B]/30 transition-transform hover:scale-105"
          >
            {loadingPlan === 'big_bite' ? 'Activating Plan...' : user?.plan === 'big_bite' ? 'Current Plan' : 'Upgrade to Big Bite'}
          </button>
        </div>

        {/* Tier 3: Shared Bite */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-[#E8E6E1] dark:border-slate-700 shadow-soft flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-[#5B6B7A]/15 text-[#5B6B7A] dark:text-slate-300 text-[11px] font-bold">
              Family & Household
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white">
              Shared Bite
            </h3>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
              For families and couples managing shared groceries and nutrition together.
            </p>

            <div className="pt-2">
              <span className="font-serif text-4xl font-extrabold text-[#5B6B7A] dark:text-white">
                {priceFor('shared_bite') == null ? '—' : `₹${Number(priceFor('shared_bite')).toLocaleString('en-IN')}`}
              </span>
              <span className="text-xs text-[#5B6B7A] dark:text-slate-400">
                {' / month'}
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#2E2E2E] dark:text-slate-300 pt-4 border-t border-[#E8E6E1] dark:border-slate-700">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2E7D6B] shrink-0" />
                <span className="font-bold">Everything in Big Bite</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2E7D6B] shrink-0" />
                <span>Up to 4 Household Members</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2E7D6B] shrink-0" />
                <span>Shared grocery budget & spend alerts</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2E7D6B] shrink-0" />
                <span>Household nutritional health index</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#2E7D6B] shrink-0" />
                <span>Shared pantry & synchronized shopping list</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('shared_bite')}
            disabled={loadingPlan === 'shared_bite'}
            className="w-full py-3.5 rounded-xl font-bold text-xs bg-[#5B6B7A] text-white hover:bg-[#485663] transition-colors"
          >
            {loadingPlan === 'shared_bite' ? 'Activating Plan...' : user?.plan === 'shared_bite' ? 'Current Plan' : 'Get Shared Bite'}
          </button>
        </div>

      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-6">
        <h3 className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white text-center">
          Compare All Features Side by Side
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E6E1] dark:border-slate-700 text-[#5B6B7A]">
                <th className="py-3 font-bold">Feature</th>
                <th className="py-3 font-bold text-center">Small Bite (Free)</th>
                <th className="py-3 font-bold text-center text-[#C75A3B]">Big Bite ({priceFor('big_bite') == null ? '—' : `₹${Number(priceFor('big_bite')).toLocaleString('en-IN')}`}/mo)</th>
                <th className="py-3 font-bold text-center">Shared Bite ({priceFor('shared_bite') == null ? '—' : `₹${Number(priceFor('shared_bite')).toLocaleString('en-IN')}`}/mo)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6E1] dark:divide-slate-700">
              <tr>
                <td className="py-3 font-semibold text-[#2E2E2E] dark:text-white">AI Food Image Scanner</td>
                <td className="py-3 text-center text-[#5B6B7A]">10 scans / month</td>
                <td className="py-3 text-center font-bold text-[#C75A3B]">Unlimited</td>
                <td className="py-3 text-center font-bold">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-[#2E2E2E] dark:text-white">Grocery Receipt OCR</td>
                <td className="py-3 text-center text-[#5B6B7A]">5 receipts / month</td>
                <td className="py-3 text-center font-bold text-[#C75A3B]">Unlimited</td>
                <td className="py-3 text-center font-bold">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-[#2E2E2E] dark:text-white">AI Nutrition & Budget Coach</td>
                <td className="py-3 text-center text-stone-400">—</td>
                <td className="py-3 text-center font-bold text-[#C75A3B]">✓ 24/7 Access</td>
                <td className="py-3 text-center font-bold">✓ 24/7 Access</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-[#2E2E2E] dark:text-white">Pantry-to-Plate AI Recipes</td>
                <td className="py-3 text-center text-stone-400">Basic</td>
                <td className="py-3 text-center font-bold text-[#C75A3B]">✓ Personalized</td>
                <td className="py-3 text-center font-bold">✓ Personalized</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-[#2E2E2E] dark:text-white">"What If I Changed This?" Simulator</td>
                <td className="py-3 text-center text-stone-400">3 swaps / month</td>
                <td className="py-3 text-center font-bold text-[#C75A3B]">✓ Unlimited Swaps</td>
                <td className="py-3 text-center font-bold">✓ Unlimited Swaps</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-[#2E2E2E] dark:text-white">Bite Currency Rewards</td>
                <td className="py-3 text-center text-stone-400">—</td>
                <td className="py-3 text-center font-bold text-[#C75A3B]">✓ Up to ₹500/mo</td>
                <td className="py-3 text-center font-bold">✓ Up to ₹1,000/mo</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-[#2E2E2E] dark:text-white">Family / Household Members</td>
                <td className="py-3 text-center text-[#5B6B7A]">1 Member</td>
                <td className="py-3 text-center text-[#5B6B7A]">1 Member</td>
                <td className="py-3 text-center font-bold">Up to 4 Members</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Trust & Guarantee */}
      <div className="p-6 rounded-3xl bg-[#FAF8F4] dark:bg-slate-800/60 border border-[#E8E6E1] dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-[#2E7D6B]/15 text-[#2E7D6B]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
              14-Day Risk-Free Guarantee
            </h4>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
              Upgrade with confidence. If you don't love BiteSize, cancel anytime with 1 click.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('contact')}
          className="text-xs font-bold text-[#C75A3B] hover:underline"
        >
          Have questions? Talk to our team →
        </button>
      </div>

    </div>
  );
};
