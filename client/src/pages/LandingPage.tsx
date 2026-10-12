import React from 'react';
import {
  Camera,
  Receipt,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  Coins,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Apple
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onQuickDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onQuickDemo }) => {
  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#F6D6C9]/60 border border-[#C75A3B]/20 text-[#C75A3B] text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Grocery & Nutrition Intelligence Platform</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2E2E2E] dark:text-white tracking-tight leading-[1.15]">
            Better food choices. <br />
            <span className="text-[#C75A3B]">Smarter spending.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5B6B7A] dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            BiteSize turns grocery receipts and meal photos into personalized guidance. Understand what you buy, what you eat, and how to optimize both with AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm bg-[#C75A3B] text-white shadow-lg shadow-[#C75A3B]/25 hover:bg-[#b0482b] transition-all hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onQuickDemo}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm bg-white dark:bg-slate-800 text-[#2E2E2E] dark:text-white border border-[#E8E6E1] dark:border-slate-700 shadow-sm hover:border-[#C75A3B] transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Interactive Demo</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#FAF8F4] dark:bg-slate-700 text-[#C75A3B] font-bold">1-Click</span>
            </button>
          </div>

          <div className="flex items-center justify-center space-x-6 text-xs text-[#5B6B7A] dark:text-slate-400 pt-3">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D6B]" />
              <span>No credit card required</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2E7D6B]" />
              <span>IFCT & ICMR-NIN Verified Data</span>
            </span>
            <span className="flex items-center space-x-1.5 hidden md:flex">
              <Coins className="w-4 h-4 text-[#D4A85A]" />
              <span>7.5% Bite Currency Rewards</span>
            </span>
          </div>
        </div>

        {/* Brand App Preview Cards Grid (Matches Uploaded Design Sheet!) */}
        <div className="mt-14 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Daily Nutrition & Macros */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[#5B6B7A] dark:text-slate-400 uppercase tracking-wider">Daily Nutrition</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#2E7D6B]/10 text-[#2E7D6B] font-medium">On Track</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full border-4 border-[#C75A3B] flex items-center justify-center">
                <div className="text-center">
                  <span className="text-lg font-bold text-[#2E2E2E] dark:text-white">72%</span>
                  <span className="block text-[9px] text-[#5B6B7A]">Complete</span>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-[#5B6B7A] dark:text-slate-300">
                <div className="flex justify-between space-x-4">
                  <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#C75A3B] mr-1.5"></span>Protein</span>
                  <span className="font-semibold text-[#2E2E2E] dark:text-white">62g / 85g</span>
                </div>
                <div className="flex justify-between space-x-4">
                  <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#D4A85A] mr-1.5"></span>Carbs</span>
                  <span className="font-semibold text-[#2E2E2E] dark:text-white">180g / 250g</span>
                </div>
                <div className="flex justify-between space-x-4">
                  <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#5B6B7A] mr-1.5"></span>Fats</span>
                  <span className="font-semibold text-[#2E2E2E] dark:text-white">42g / 60g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Monthly Grocery Spend */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[#5B6B7A] dark:text-slate-400 uppercase tracking-wider">Monthly Spending</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#2E7D6B]/10 text-[#2E7D6B] font-medium flex items-center">
                <TrendingDown className="w-3 h-3 mr-0.5" /> 12% vs last mo
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-[#2E2E2E] dark:text-white">₹4,250</span>
                <span className="text-xs text-[#5B6B7A]">/ ₹7,500 budget</span>
              </div>
              <div className="w-full bg-[#E8E6E1] dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#5B6B7A] to-[#C75A3B] h-full rounded-full" style={{ width: '56%' }}></div>
              </div>
              <p className="text-[11px] text-[#5B6B7A] dark:text-slate-400">
                ₹3,250 remaining buffer for remaining 18 days.
              </p>
            </div>
          </div>

          {/* Card 3: Bite Currency Rewards */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[#D4A85A] uppercase tracking-wider">You Earned Bite Currency!</span>
              <Coins className="w-4 h-4 text-[#D4A85A]" />
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4A85A] to-[#F6E3B7] flex items-center justify-center font-bold text-white text-xl shadow-md shadow-[#D4A85A]/20">
                ₹
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#2E2E2E] dark:text-white">₹320</span>
                <p className="text-[11px] text-[#5B6B7A] dark:text-slate-400">7.5% of eligible monthly bill</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#E8E6E1] dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="text-[#5B6B7A]">Redeemable via First Club</span>
              <span className="font-semibold text-[#C75A3B]">Claim Voucher →</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 4 GAPS BITESIZE SOLVES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white">
            Connecting what you buy, what you eat, and what you can afford
          </h2>
          <p className="text-sm text-[#5B6B7A] dark:text-slate-400 mt-2">
            Most apps only solve one side of the equation. BiteSize bridges the entire lifestyle loop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#FAF8F4] dark:bg-slate-800/60 p-6 rounded-2xl border border-[#E8E6E1] dark:border-slate-700 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#C75A3B]/10 text-[#C75A3B] flex items-center justify-center font-bold">1</div>
            <h3 className="font-semibold text-base text-[#2E2E2E] dark:text-white">The Nutrition Gap</h3>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400 leading-relaxed">
              People rarely know if their grocery basket matches their health goals, and complex food labels are hard to compare.
            </p>
          </div>

          <div className="bg-[#FAF8F4] dark:bg-slate-800/60 p-6 rounded-2xl border border-[#E8E6E1] dark:border-slate-700 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#5B6B7A]/10 text-[#5B6B7A] flex items-center justify-center font-bold">2</div>
            <h3 className="font-semibold text-base text-[#2E2E2E] dark:text-white">The Budgeting Gap</h3>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400 leading-relaxed">
              A supermarket receipt shows a grand total, but never reveals what individual meals cost per serving or where leaks occur.
            </p>
          </div>

          <div className="bg-[#FAF8F4] dark:bg-slate-800/60 p-6 rounded-2xl border border-[#E8E6E1] dark:border-slate-700 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4A85A]/10 text-[#D4A85A] flex items-center justify-center font-bold">3</div>
            <h3 className="font-semibold text-base text-[#2E2E2E] dark:text-white">The Daily Tracking Gap</h3>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400 leading-relaxed">
              Traditional calorie counting requires laborious manual ingredient searches. BiteSize lets you snap a photo with honest AI calibration.
            </p>
          </div>

          <div className="bg-[#FAF8F4] dark:bg-slate-800/60 p-6 rounded-2xl border border-[#E8E6E1] dark:border-slate-700 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#2E7D6B]/10 text-[#2E7D6B] flex items-center justify-center font-bold">4</div>
            <h3 className="font-semibold text-base text-[#2E2E2E] dark:text-white">The Decision Gap</h3>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400 leading-relaxed">
              Generic advice tells you what's "good" or "bad". Our "What If I Changed This?" tool reveals real nutrition and cost trade-offs.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CORE HIGHLIGHT: AI MEAL SCANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white to-[#F8F7F4] dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 sm:p-12 border border-[#E8E6E1] dark:border-slate-700 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="px-3 py-1 rounded-full bg-[#C75A3B]/10 text-[#C75A3B] text-xs font-semibold">
              Highest Accuracy Priority
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E2E2E] dark:text-white leading-tight">
              AI-Powered Meal Scanner with Calibrated Precision
            </h2>
            <p className="text-sm text-[#5B6B7A] dark:text-slate-300 leading-relaxed">
              We never fabricate calorie counts or pretend AI estimates are laboratory measurements. BiteSize identifies components, applies authentic ICMR-NIN Indian Food Composition Tables, and prompts you to confirm cooking oils, portions, and sauces.
            </p>
            <ul className="space-y-3 text-xs text-[#2E2E2E] dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D6B] shrink-0" />
                <span>Transparent uncertainty indicators (±10% to ±15%)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D6B] shrink-0" />
                <span>Adjustable cooking methods (tempering ghee, light sauté, boiled)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D6B] shrink-0" />
                <span>One-click save to daily nutrition tracker and macro rings</span>
              </li>
            </ul>
            <div>
              <button
                onClick={() => onNavigate('scan-meal')}
                className="px-6 py-3 rounded-xl font-semibold text-xs bg-[#C75A3B] text-white hover:bg-[#b0482b] transition-all flex items-center space-x-2 shadow-md shadow-[#C75A3B]/20"
              >
                <Camera className="w-4 h-4" />
                <span>Try Food Scanner Now</span>
              </button>
            </div>
          </div>

          <div className="bg-[#FAF8F4] dark:bg-slate-800 p-6 rounded-2xl border border-[#E8E6E1] dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6E1] dark:border-slate-700">
              <div>
                <p className="text-xs font-semibold text-[#2E2E2E] dark:text-white">Moong Dal Tadka with Steamed Rice</p>
                <p className="text-[11px] text-[#5B6B7A]">Visual confidence: 91% • ±10% variance</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2E7D6B]/15 text-[#2E7D6B]">
                IFCT Verified
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700">
                <span className="block text-xs text-[#5B6B7A]">Calories</span>
                <span className="font-bold text-sm text-[#2E2E2E] dark:text-white">460</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700">
                <span className="block text-xs text-[#5B6B7A]">Protein</span>
                <span className="font-bold text-sm text-[#C75A3B]">17.8g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700">
                <span className="block text-xs text-[#5B6B7A]">Carbs</span>
                <span className="font-bold text-sm text-[#2E2E2E] dark:text-white">74.0g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700">
                <span className="block text-xs text-[#5B6B7A]">Fiber</span>
                <span className="font-bold text-sm text-[#2E7D6B]">6.5g</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF8F4] dark:bg-slate-700/60 border border-[#E8E6E1] dark:border-slate-600 text-xs text-[#5B6B7A] dark:text-slate-300">
              <span className="font-semibold text-[#C75A3B]">Clarification confirmed:</span> 1/2 tsp ghee used for cumin tadka tempering (+22 kcal).
            </div>
          </div>
        </div>
      </section>

      {/* 4. THREE SUBSCRIPTION PLANS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white">
            Transparent, Predictable Plans
          </h2>
          <p className="text-sm text-[#5B6B7A] dark:text-slate-400 mt-2">
            Start free with Small Bite, unlock deep personal coaching with Big Bite, or coordinate your entire household with Shared Bite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Small Bite */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-[#E8E6E1] dark:border-slate-700 shadow-soft flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#5B6B7A] uppercase tracking-wider">Free Forever</span>
              <h3 className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white mt-1">Small Bite</h3>
              <p className="text-3xl font-extrabold text-[#2E2E2E] dark:text-white mt-4">₹0 <span className="text-xs font-normal text-[#5B6B7A]">/ month</span></p>
              <p className="text-xs text-[#5B6B7A] dark:text-slate-400 mt-2 leading-relaxed">
                A useful taste of receipt scanning and nutrition tracking with fair-use limits.
              </p>

              <div className="border-t border-[#E8E6E1] dark:border-slate-700 my-6"></div>

              <ul className="space-y-3 text-xs text-[#2E2E2E] dark:text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D6B]" />
                  <span>3 receipt scans per month</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D6B]" />
                  <span>10 AI meal photo scans</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D6B]" />
                  <span>Basic grocery spend overview</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D6B]" />
                  <span>1 individual profile</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigate('register')}
              className="mt-8 w-full py-3 rounded-xl text-xs font-semibold border border-[#E8E6E1] dark:border-slate-700 hover:border-[#C75A3B] transition-colors"
            >
              Get Started Free
            </button>
          </div>

          {/* Big Bite - Most Popular */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-[#C75A3B] shadow-xl relative flex flex-col justify-between">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#C75A3B] text-white text-[11px] font-bold tracking-wider uppercase">
              Most Popular
            </div>

            <div>
              <span className="text-xs font-semibold text-[#C75A3B] uppercase tracking-wider">Premium Individual</span>
              <h3 className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white mt-1">Big Bite</h3>
              <p className="text-3xl font-extrabold text-[#2E2E2E] dark:text-white mt-4">₹199 <span className="text-xs font-normal text-[#5B6B7A]">/ month</span></p>
              <p className="text-xs text-[#5B6B7A] dark:text-slate-400 mt-2 leading-relaxed">
                The best value for individuals seeking ongoing nutrition coaching and smart basket optimization.
              </p>

              <div className="border-t border-[#E8E6E1] dark:border-slate-700 my-6"></div>

              <ul className="space-y-3 text-xs text-[#2E2E2E] dark:text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C75A3B]" />
                  <span className="font-medium">Unlimited fair-use receipt & meal scans</span>
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
              onClick={() => onNavigate('subscriptions')}
              className="mt-8 w-full py-3 rounded-xl text-xs font-semibold bg-[#C75A3B] text-white hover:bg-[#b0482b] transition-all shadow-md shadow-[#C75A3B]/25"
            >
              Choose Big Bite
            </button>
          </div>

          {/* Shared Bite */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-[#E8E6E1] dark:border-slate-700 shadow-soft flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#5B6B7A] uppercase tracking-wider">Premium Family</span>
              <h3 className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white mt-1">Shared Bite</h3>
              <p className="text-3xl font-extrabold text-[#2E2E2E] dark:text-white mt-4">₹399 <span className="text-xs font-normal text-[#5B6B7A]">/ month</span></p>
              <p className="text-xs text-[#5B6B7A] dark:text-slate-400 mt-2 leading-relaxed">
                Coordinated grocery planning under one shared household budget with private personal meal logs.
              </p>

              <div className="border-t border-[#E8E6E1] dark:border-slate-700 my-6"></div>

              <ul className="space-y-3 text-xs text-[#2E2E2E] dark:text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D6B]" />
                  <span>Everything in Big Bite</span>
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
                  <span>Separate confidential meal logs per member</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigate('subscriptions')}
              className="mt-8 w-full py-3 rounded-xl text-xs font-semibold bg-[#5B6B7A] text-white hover:bg-[#495764] transition-colors"
            >
              Choose Shared Bite
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
