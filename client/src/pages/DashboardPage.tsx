import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../services/api';
import { UncertaintyBadge } from '../components/UncertaintyBadge';
import {
  Camera,
  Receipt,
  Sparkles,
  ArrowRightLeft,
  Coins,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getOverview();
      if (res.success) {
        setData(res);
      } else {
        setError('Could not load dashboard data.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-pulse">
        <div className="h-10 bg-stone-200 dark:bg-slate-700 rounded-xl w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-44 bg-stone-200 dark:bg-slate-700 rounded-2xl"></div>
          <div className="h-44 bg-stone-200 dark:bg-slate-700 rounded-2xl"></div>
          <div className="h-44 bg-stone-200 dark:bg-slate-700 rounded-2xl"></div>
        </div>
        <div className="h-96 bg-stone-200 dark:bg-slate-700 rounded-2xl"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white dark:bg-slate-800 rounded-2xl border border-red-200 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-[#2E2E2E] dark:text-white">Dashboard Error</h3>
        <p className="text-xs text-[#5B6B7A] dark:text-slate-300">{error || 'Something went wrong.'}</p>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#C75A3B] text-white hover:bg-[#b0482b]"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { todayMacros, budgetOverview, todayMeals, recentReceipts, goalsSummary, insights, suggestedMeal, profile } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E8E6E1] dark:border-slate-800">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white tracking-tight">
            Good day, {profile?.display_name || 'Friend'}
          </h1>
          <p className="text-xs text-[#5B6B7A] dark:text-slate-400 mt-1 flex items-center space-x-2">
            <span className="w-2 h-2 ui-dot bg-[#2E7D6B]"></span>
            <span>Target: {profile?.fitness_goal?.replace(/_/g, ' ')} • Daily intake calibrated to {profile?.calorie_target} kcal</span>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('scan-meal')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#C75A3B] text-white hover:bg-[#b0482b] transition-transform hover:scale-105 shadow-sm shadow-[#C75A3B]/20"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Meal</span>
          </button>
          <button
            onClick={() => onNavigate('diary')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-[#2E2E2E] dark:text-white border border-[#E8E6E1] dark:border-slate-700 hover:border-[#C75A3B] transition-colors"
          >
            <Calendar className="w-4 h-4 text-[#C75A3B]" />
            <span>Food Diary</span>
          </button>
          <button
            onClick={() => onNavigate('meal-planner')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-[#2E2E2E] dark:text-white border border-[#E8E6E1] dark:border-slate-700 hover:border-[#C75A3B] transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#D4A85A]" />
            <span>Meal Planner</span>
          </button>
          <button
            onClick={() => onNavigate('scan-receipt')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-[#2E2E2E] dark:text-white border border-[#E8E6E1] dark:border-slate-700 hover:border-[#C75A3B] transition-colors"
          >
            <Receipt className="w-4 h-4 text-[#5B6B7A]" />
            <span>Upload Receipt</span>
          </button>
          <button
            onClick={() => onNavigate('progress')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-[#2E2E2E] dark:text-white border border-[#E8E6E1] dark:border-slate-700 hover:border-[#C75A3B] transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-[#2E7D6B]" />
            <span>Progress</span>
          </button>
          <button
            onClick={() => onNavigate('coach')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#5B6B7A] text-white hover:bg-[#495764] transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#F6D6C9]" />
            <span>Ask Coach</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards (Nutrition, Grocery Budget, Bite Currency) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Today's Calorie Progress */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#5B6B7A] dark:text-slate-400 uppercase tracking-wider">
              Calorie Intake Today
            </span>
            <UncertaintyBadge uncertaintyRange="Review portion" />
          </div>

          <div className="flex items-center space-x-5">
            {/* Circular Gauge */}
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-stone-200 dark:text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#C75A3B]"
                  strokeDasharray={`${todayMacros.calorieProgress}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold text-[#2E2E2E] dark:text-white">
                  {todayMacros.calorieProgress}%
                </span>
                <span className="block text-[9px] text-[#5B6B7A]">of target</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-black text-[#2E2E2E] dark:text-white">
                {todayMacros.calories}{' '}
                <span className="text-xs font-normal text-[#5B6B7A]">/ {todayMacros.calorieTarget} kcal</span>
              </div>
              <p className="text-xs text-[#5B6B7A] dark:text-slate-300">
                {Math.max(0, todayMacros.calorieTarget - todayMacros.calories)} kcal remaining for dinner/evening.
              </p>
              <span className="inline-block text-[10px] font-semibold text-[#2E7D6B] bg-[#2E7D6B]/10 px-2 py-0.5 rounded-full mt-1">
                {todayMeals.length} meal(s) logged today
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Grocery Budget Progress */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#5B6B7A] dark:text-slate-400 uppercase tracking-wider">
              Monthly Grocery Budget
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#2E7D6B]/10 text-[#2E7D6B] font-semibold flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" /> On Track
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-[#2E2E2E] dark:text-white">
                  ₹{budgetOverview.currentSpent.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-[#5B6B7A] ml-1">
                  / ₹{budgetOverview.monthlyBudget.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-xs font-bold text-[#5B6B7A]">
                {budgetOverview.percentUsed}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#E8E6E1] dark:bg-slate-700 h-2.5 ui-progress-track overflow-hidden">
              <div
                className="h-full ui-progress-fill transition-all duration-500 bg-gradient-to-r from-[#2E7D6B] to-[#D4A85A]"
                style={{ width: `${Math.min(100, budgetOverview.percentUsed)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-[#5B6B7A] dark:text-slate-400 pt-1">
              <span>Remaining: ₹{budgetOverview.remaining.toLocaleString('en-IN')}</span>
              <button
                onClick={() => onNavigate('scan-receipt')}
                className="text-[#C75A3B] font-semibold hover:underline"
              >
                View Breakdown →
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Bite Currency Rewards */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#D4A85A] uppercase tracking-wider flex items-center space-x-1">
              <Coins className="w-3.5 h-3.5 mr-1" />
              <span>Bite Currency Balance</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4A85A]/15 text-[#D4A85A]">
              7.5% Reward Active
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4A85A] to-[#F6E3B7] flex items-center justify-center font-extrabold text-white text-2xl shadow-md shadow-[#D4A85A]/25">
              ₹
            </div>
            <div>
              <div className="text-3xl font-black text-[#2E2E2E] dark:text-white">
                ₹{Math.round(goalsSummary.biteCurrencyBalance)}
              </div>
              <p className="text-[11px] text-[#5B6B7A] dark:text-slate-400 mt-0.5">
                Calculated on eligible grocery receipts
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E8E6E1] dark:border-slate-700 flex items-center justify-between text-xs">
            <span className="text-[#5B6B7A]">Goal progress: {goalsSummary.completionRate}%</span>
            <button
              onClick={() => onNavigate('rewards')}
              className="text-[#C75A3B] font-semibold hover:underline"
            >
              Redeem First Club →
            </button>
          </div>
        </div>
      </div>

      {/* 3. Daily Macronutrient Breakdown Bars */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">
              Daily Macronutrient Target Progress
            </h3>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
              Aggregated from your confirmed meal photos and manual logs.
            </p>
          </div>
          <button
            onClick={() => onNavigate('scan-meal')}
            className="text-xs font-semibold text-[#C75A3B] hover:underline flex items-center space-x-1"
          >
            <span>+ Add Meal Entry</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
          {/* Protein */}
          <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#2E2E2E] dark:text-white flex items-center">
                <span className="w-2.5 h-2.5 ui-dot bg-[#C75A3B] mr-2"></span>
                Protein
              </span>
              <span className="font-bold text-[#C75A3B]">
                {todayMacros.protein}g / {todayMacros.proteinTarget}g
              </span>
            </div>
            <div className="w-full bg-[#E8E6E1] dark:bg-slate-600 h-2 ui-progress-track overflow-hidden">
              <div
                className="bg-[#C75A3B] h-full ui-progress-fill transition-all"
                style={{ width: `${todayMacros.proteinProgress}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-[#5B6B7A] dark:text-slate-400">
              {todayMacros.proteinProgress}% of daily recovery target
            </p>
          </div>

          {/* Carbs */}
          <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#2E2E2E] dark:text-white flex items-center">
                <span className="w-2.5 h-2.5 ui-dot bg-[#D4A85A] mr-2"></span>
                Carbohydrates
              </span>
              <span className="font-bold text-[#D4A85A]">
                {todayMacros.carbs}g / {todayMacros.carbTarget}g
              </span>
            </div>
            <div className="w-full bg-[#E8E6E1] dark:bg-slate-600 h-2 ui-progress-track overflow-hidden">
              <div
                className="bg-[#D4A85A] h-full ui-progress-fill transition-all"
                style={{ width: `${todayMacros.carbProgress}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-[#5B6B7A] dark:text-slate-400">
              {todayMacros.carbProgress}% of daily energy target
            </p>
          </div>

          {/* Fats */}
          <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#2E2E2E] dark:text-white flex items-center">
                <span className="w-2.5 h-2.5 ui-dot bg-[#5B6B7A] mr-2"></span>
                Healthy Fats
              </span>
              <span className="font-bold text-[#5B6B7A]">
                {todayMacros.fat}g / {todayMacros.fatTarget}g
              </span>
            </div>
            <div className="w-full bg-[#E8E6E1] dark:bg-slate-600 h-2 ui-progress-track overflow-hidden">
              <div
                className="bg-[#5B6B7A] h-full ui-progress-fill transition-all"
                style={{ width: `${todayMacros.fatProgress}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-[#5B6B7A] dark:text-slate-400">
              {todayMacros.fatProgress}% of daily hormonal balance
            </p>
          </div>

          {/* Fiber */}
          <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#2E2E2E] dark:text-white flex items-center">
                <span className="w-2.5 h-2.5 ui-dot bg-[#2E7D6B] mr-2"></span>
                Dietary Fiber
              </span>
              <span className="font-bold text-[#2E7D6B]">
                {todayMacros.fiber}g / {todayMacros.fiberTarget}g
              </span>
            </div>
            <div className="w-full bg-[#E8E6E1] dark:bg-slate-600 h-2 ui-progress-track overflow-hidden">
              <div
                className="bg-[#2E7D6B] h-full ui-progress-fill transition-all"
                style={{ width: `${todayMacros.fiberProgress}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-[#5B6B7A] dark:text-slate-400">
              {todayMacros.fiberProgress}% of digestive wellness goal
            </p>
          </div>
        </div>
      </div>

      {/* 4. Two-Column Layout: Live Logged Meals & Recent Grocery Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Today's Logged Meals */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-[#C75A3B]" />
              <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">
                Today's Meal Intake Log
              </h3>
            </div>
            <button
              onClick={() => onNavigate('scan-meal')}
              className="text-xs font-semibold text-[#C75A3B] hover:underline"
            >
              Scan New Meal →
            </button>
          </div>

          {todayMeals.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-[#E8E6E1] dark:border-slate-700 rounded-2xl space-y-3">
              <Camera className="w-8 h-8 text-[#5B6B7A] mx-auto opacity-50" />
              <p className="text-xs text-[#5B6B7A]">No meals photographed today yet.</p>
              <button
                onClick={() => onNavigate('scan-meal')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#C75A3B] text-white"
              >
                Photograph First Meal
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayMeals.map((meal: any) => (
                <div
                  key={meal.id}
                  className="p-3.5 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/60 border border-[#E8E6E1] dark:border-slate-600 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#2E2E2E] dark:text-white">
                        {meal.meal_name}
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-stone-200 dark:bg-slate-600 text-stone-700 dark:text-slate-200">
                        {meal.meal_type}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5B6B7A] dark:text-slate-300">
                      {meal.calories} kcal • {meal.protein}g protein • {meal.portion_grams}g portion
                    </p>
                  </div>
                  <UncertaintyBadge uncertaintyRange={meal.uncertainty_range} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Grocery Receipts */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-[#5B6B7A]" />
              <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">
                Recent Grocery Receipts
              </h3>
            </div>
            <button
              onClick={() => onNavigate('scan-receipt')}
              className="text-xs font-semibold text-[#C75A3B] hover:underline"
            >
              Scan Receipt →
            </button>
          </div>

          {recentReceipts.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-[#E8E6E1] dark:border-slate-700 rounded-2xl space-y-3">
              <Receipt className="w-8 h-8 text-[#5B6B7A] mx-auto opacity-50" />
              <p className="text-xs text-[#5B6B7A]">No grocery receipts scanned yet.</p>
              <button
                onClick={() => onNavigate('scan-receipt')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2E2E2E] text-white"
              >
                Scan First Receipt
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentReceipts.map((rcpt: any) => (
                <div
                  key={rcpt.id}
                  className="p-3.5 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/60 border border-[#E8E6E1] dark:border-slate-600 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#2E2E2E] dark:text-white">{rcpt.store_name}</p>
                    <p className="text-[11px] text-[#5B6B7A] dark:text-slate-300 flex items-center space-x-2">
                      <span>{rcpt.receipt_date}</span>
                      <span>•</span>
                      <span>{rcpt.items_count} items</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#2E2E2E] dark:text-white">
                      ₹{rcpt.total_amount.toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-[#2E7D6B] font-medium">+7.5% Bite Currency</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. AI Generated Nutrition & Budget Insights */}
      {insights && insights.length > 0 && (
        <div className="bg-gradient-to-br from-[#F8F7F4] to-white dark:from-slate-800 dark:to-slate-900 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#C75A3B]" />
            <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">
              AI Coach Intelligence & Active Insights
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((ins: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E8E6E1] dark:border-slate-700 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#FAF8F4] dark:bg-slate-700 text-[#C75A3B]">
                    {ins.tag}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-[#2E2E2E] dark:text-white">{ins.title}</h4>
                <p className="text-xs text-[#5B6B7A] dark:text-slate-300 leading-relaxed">{ins.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Suggested Pantry-to-Plate Recipe Preview */}
      {suggestedMeal && (
        <div className="bg-[#1E2A3A] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-[#F6D6C9]">
              Suggested From Your Pantry
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">{suggestedMeal.title}</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Matches pantry items: {suggestedMeal.matchedIngredients.join(', ')} ({suggestedMeal.matchPercentage}% ingredient match). Takes {suggestedMeal.prepTimeMinutes + suggestedMeal.cookTimeMinutes} minutes; nutrition is an estimate per serving.
            </p>
          </div>
          <button
            onClick={() => onNavigate('pantry')}
            className="shrink-0 px-6 py-3 rounded-xl text-xs font-semibold bg-[#C75A3B] text-white hover:bg-[#b0482b] transition-transform hover:scale-105 flex items-center space-x-2"
          >
            <span>Cook With What You Have</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
