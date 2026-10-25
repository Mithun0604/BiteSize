import React, { useState, useEffect } from 'react';
import { subApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { openRazorpayCheckout } from '../services/razorpayCheckout';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CreditCard,
  Lock,
  RefreshCw
} from 'lucide-react';

interface SubscriptionsProps {
  onNavigate: (page: string) => void;
}

export const SubscriptionsPage: React.FC<SubscriptionsProps> = ({ onNavigate }) => {
  const { user, updateUserPlan } = useAuth();
  const [subStatus, setSubStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await subApi.getStatus();
      if (res.success) {
        setSubStatus(res);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to fetch subscription info.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const priceFor = (planId: string) => {
    const price = subStatus?.plans?.find((plan: any) => plan.id === planId)?.price;
    return Number.isFinite(Number(price)) ? `₹${Number(price).toLocaleString('en-IN')}` : '—';
  };

  const handleUpgrade = async (planId: string) => {
    setProcessingPlanId(planId);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      // 1. Create order on backend
      const orderRes = await subApi.createCheckout(planId);
      if (!orderRes.success) {
        throw new Error(orderRes.message || 'Could not initiate checkout');
      }

      // 2. Verified Sandbox or Razorpay Checkout
      if (orderRes.isSandbox) {
        // Complete verified sandbox payment simulation
        const verifyRes = await subApi.verifyPayment({
          razorpayPaymentId: `pay_sandbox_${Date.now()}`,
          razorpayOrderId: orderRes.orderId,
          razorpaySignature: 'sandbox_verified_sig',
          planId
        });

        if (verifyRes.success) {
          setStatusMessage(`${verifyRes.message} ${verifyRes.data?.paymentNotice || 'TEST MODE: no payment was processed.'}`);
          updateUserPlan(planId as any);
          fetchStatus();
        }
      } else {
        const payment = await openRazorpayCheckout(orderRes);
        if (!payment) return;
        const verifyRes = await subApi.verifyPayment({
          razorpayPaymentId: payment.razorpay_payment_id,
          razorpayOrderId: payment.razorpay_order_id,
          razorpaySignature: payment.razorpay_signature,
          planId
        });
        if (verifyRes.success) {
          setStatusMessage(verifyRes.message);
          updateUserPlan(planId as any);
          fetchStatus();
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment initiation failed.');
    } finally {
      setProcessingPlanId(null);
    }
  };

  const handleCancel = async () => {
    if (confirm("Are you sure you want to cancel your paid subscription? You will be reverted to Small Bite (Free).")) {
      try {
        const res = await subApi.cancelSub();
        if (res.success) {
          setStatusMessage(res.message);
          updateUserPlan('small_bite');
          fetchStatus();
        }
      } catch (err: any) {
        alert("Failed to cancel subscription.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C75A3B]/10 text-[#C75A3B] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Transparent Nutrition & Grocery Intelligence</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E2E2E] dark:text-white">
          Subscription Plans & Billing
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6B7A] dark:text-slate-400 leading-relaxed">
          Unlock personalized grocery intelligence, unlimited food photo analysis, and family budget coordination. Cancel or change plans anytime.
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-[#2E7D6B]/15 border border-[#2E7D6B]/30 text-xs text-[#2E7D6B] font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-[#D96B6B] flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Current Active Plan Card */}
      {subStatus && (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF8F4] dark:bg-slate-700 text-[#C75A3B]">
              Your Active Subscription
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white">
              {subStatus.currentPlan.name}
            </h3>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
              {subStatus.currentPlan.price === 0
                ? 'Free monthly plan. Upgrade anytime to unlock full AI Coach and unlimited scanning.'
                : `Billed ₹${subStatus.currentPlan.price}/month. Next renewal date: ${subStatus.subscription.next_billing_date || 'In 30 days'}.`}
            </p>

            <div className="pt-2 flex items-center space-x-4 text-xs text-[#5B6B7A]">
              <span>Receipt Scans: <strong>{subStatus.usage.receiptScansUsed}</strong> / {subStatus.usage.receiptScanLimit > 1000 ? 'Unlimited' : subStatus.usage.receiptScanLimit}</span>
              <span>•</span>
              <span>Meal Scans: <strong>{subStatus.usage.mealScansUsed}</strong> / {subStatus.usage.mealScanLimit > 1000 ? 'Unlimited' : subStatus.usage.mealScanLimit}</span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center sm:items-end space-y-2">
            {subStatus.currentPlan.id !== 'small_bite' && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#D96B6B] border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                Cancel Subscription
              </button>
            )}
            <span className="text-[10px] text-[#5B6B7A] flex items-center space-x-1">
              <Lock className="w-3 h-3 text-[#2E7D6B]" />
              <span>{subStatus.paymentMode === 'sandbox' ? 'TEST MODE — no payments processed' : 'Razorpay live checkout'}</span>
            </span>
          </div>
        </div>
      )}

      {/* Plans Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Small Bite */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-[#E8E6E1] dark:border-slate-700 shadow-soft flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-[#5B6B7A] uppercase tracking-wider">Free Forever</span>
            <h3 className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white mt-1">Small Bite</h3>
            <p className="text-3xl font-extrabold text-[#2E2E2E] dark:text-white mt-4">₹0 <span className="text-xs font-normal text-[#5B6B7A]">/ month</span></p>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400 mt-2">Essential grocery overview and photo tracking with baseline limits.</p>

            <div className="border-t border-[#E8E6E1] dark:border-slate-700 my-6"></div>

            <ul className="space-y-3 text-xs text-[#2E2E2E] dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D6B]" />
                <span>3 receipt scans / month</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D6B]" />
                <span>10 meal-photo scans</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D6B]" />
                <span>Basic grocery spend summary</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D6B]" />
                <span>1 individual profile</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <span className="block text-center text-xs font-semibold text-[#5B6B7A] py-3">
              {user?.plan === 'small_bite' ? 'Current Plan' : 'Free Baseline'}
            </span>
          </div>
        </div>

        {/* Big Bite */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-[#C75A3B] shadow-xl relative flex flex-col justify-between">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#C75A3B] text-white text-[11px] font-bold tracking-wider uppercase">
            Recommended
          </div>

          <div>
            <span className="text-xs font-semibold text-[#C75A3B] uppercase tracking-wider">Premium Individual</span>
            <h3 className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white mt-1">Big Bite</h3>
            <p className="text-3xl font-extrabold text-[#2E2E2E] dark:text-white mt-4">{priceFor('big_bite')} <span className="text-xs font-normal text-[#5B6B7A]">/ month</span></p>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400 mt-2">The best-value plan for ongoing personal nutrition and grocery budget coaching.</p>

            <div className="border-t border-[#E8E6E1] dark:border-slate-700 my-6"></div>

            <ul className="space-y-3 text-xs text-[#2E2E2E] dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C75A3B]" />
                <span className="font-medium">Unlimited fair-use receipt scans</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C75A3B]" />
                <span>Unlimited meal-photo intake logging</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C75A3B]" />
                <span>Full BiteSize AI Coach conversational assistant</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C75A3B]" />
                <span>"What If I Changed This?" comparisons</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C75A3B]" />
                <span>Pantry-to-Plate AI & Smart Shopping List</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C75A3B]" />
                <span>7.5% Bite Currency rewards program</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('big_bite')}
            disabled={user?.plan === 'big_bite' || processingPlanId === 'big_bite'}
            className="mt-8 w-full py-3.5 rounded-xl font-bold text-xs bg-[#C75A3B] text-white hover:bg-[#b0482b] transition-all shadow-md shadow-[#C75A3B]/25 disabled:opacity-50"
          >
            {user?.plan === 'big_bite' ? 'Active Current Plan' : processingPlanId === 'big_bite' ? 'Processing Checkout...' : `Upgrade to Big Bite (${priceFor('big_bite')})`}
          </button>
        </div>

        {/* Shared Bite */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-[#E8E6E1] dark:border-slate-700 shadow-soft flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-[#5B6B7A] uppercase tracking-wider">Premium Family</span>
            <h3 className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white mt-1">Shared Bite</h3>
            <p className="text-3xl font-extrabold text-[#2E2E2E] dark:text-white mt-4">{priceFor('shared_bite')} <span className="text-xs font-normal text-[#5B6B7A]">/ month</span></p>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400 mt-2">Coordinated grocery planning under one shared household budget with private personal meal logs.</p>

            <div className="border-t border-[#E8E6E1] dark:border-slate-700 my-6"></div>

            <ul className="space-y-3 text-xs text-[#2E2E2E] dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D6B]" />
                <span>All features of Big Bite included</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D6B]" />
                <span className="font-medium">Up to 5 family member profiles</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D6B]" />
                <span>One shared household grocery budget & pantry</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D6B]" />
                <span>Separate private meal logs per member</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('shared_bite')}
            disabled={user?.plan === 'shared_bite' || processingPlanId === 'shared_bite'}
            className="mt-8 w-full py-3.5 rounded-xl font-bold text-xs bg-[#5B6B7A] text-white hover:bg-[#495764] transition-all disabled:opacity-50"
          >
            {user?.plan === 'shared_bite' ? 'Active Current Plan' : processingPlanId === 'shared_bite' ? 'Processing Checkout...' : `Upgrade to Shared Bite (${priceFor('shared_bite')})`}
          </button>
        </div>
      </div>

    </div>
  );
};
