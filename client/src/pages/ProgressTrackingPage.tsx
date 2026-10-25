import React, { useState, useEffect } from 'react';
import { reportsApi, authApi } from '../services/api';
import {
  TrendingUp,
  Activity,
  Award,
  Download,
  Calendar,
  Flame,
  CheckCircle2,
  Scale,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface ProgressTrackingProps {
  onNavigate: (page: string) => void;
}

export const ProgressTrackingPage: React.FC<ProgressTrackingProps> = ({ onNavigate }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repRes, profRes] = await Promise.all([
          reportsApi.getAnalytics(),
          authApi.getProfile()
        ]);
        if (repRes.success) setAnalytics(repRes.data);
        if (profRes.success) setProfile(profRes.profile);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentWeight = profile?.weight_kg || 68;
  const heightM = (profile?.height_cm || 172) / 100;
  const bmi = +(currentWeight / (heightM * heightM)).toFixed(1);

  const getBmiCategory = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-amber-500' };
    if (val < 25) return { label: 'Normal Healthy Weight', color: 'text-[#2E7D6B]' };
    if (val < 30) return { label: 'Overweight', color: 'text-orange-500' };
    return { label: 'Obese', color: 'text-red-500' };
  };

  const bmiCat = getBmiCategory(bmi);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#2E7D6B]/15 text-[#2E7D6B] text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Health & Nutrition Trajectory</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white mt-1">
            Progress Tracking
          </h1>
          <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
            Monitor daily calorie consistency, body weight milestones, and grocery spending correlation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href={reportsApi.exportDataUrl('csv')}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-[#E8E6E1] dark:border-slate-700 text-[#2E2E2E] dark:text-white hover:border-[#C75A3B] flex items-center space-x-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
          <button
            onClick={() => onNavigate('goals')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#C75A3B] text-white hover:bg-[#b0482b]"
          >
            Adjust Target Goals
          </button>
        </div>
      </div>

      {/* KPI Cards (Weight, BMI, Calorie Adherence, Protein Streak) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weight */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-1">
          <span className="text-xs text-[#5B6B7A] dark:text-slate-400 font-semibold">Current Weight</span>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white">
              {currentWeight}
            </span>
            <span className="text-xs text-[#5B6B7A]">kg</span>
          </div>
          <p className="text-[11px] text-[#2E7D6B] font-semibold flex items-center space-x-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-1.4 kg this month</span>
          </p>
        </div>

        {/* BMI */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-1">
          <span className="text-xs text-[#5B6B7A] dark:text-slate-400 font-semibold">Body Mass Index (BMI)</span>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white">
              {bmi}
            </span>
            <span className={`text-xs font-bold ${bmiCat.color}`}>
              {bmiCat.label}
            </span>
          </div>
          <p className="text-[11px] text-[#5B6B7A] dark:text-slate-400">
            Height: {profile?.height_cm || 172} cm
          </p>
        </div>

        {/* Calorie Adherence */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-1">
          <span className="text-xs text-[#5B6B7A] dark:text-slate-400 font-semibold">Calorie Target Adherence</span>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white">
              88%
            </span>
            <span className="text-xs text-[#2E7D6B] font-bold">On Track</span>
          </div>
          <p className="text-[11px] text-[#5B6B7A] dark:text-slate-400">
            Within ±100 kcal target range
          </p>
        </div>

        {/* Protein Consistency */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-1">
          <span className="text-xs text-[#5B6B7A] dark:text-slate-400 font-semibold">Protein Hit Rate</span>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white">
              6 / 7
            </span>
            <span className="text-xs text-[#C75A3B] font-bold">Days Met</span>
          </div>
          <p className="text-[11px] text-[#5B6B7A] dark:text-slate-400">
            Average: 82g protein/day
          </p>
        </div>
      </div>

      {/* 7-Day Calorie & Macro Intake Trend Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">
              Daily Calorie Intake (Last 7 Days)
            </h3>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
              Target baseline: {profile?.calorie_target || 2000} kcal/day
            </p>
          </div>
          <span className="text-xs font-semibold text-[#2E7D6B] bg-[#2E7D6B]/10 px-3 py-1 rounded-full">
            Healthy Deficit
          </span>
        </div>

        {/* Bar Visualizer */}
        <div className="grid grid-cols-7 gap-3 pt-6 items-end h-52">
          {[
            { day: 'Mon', cals: 1840, target: 2000 },
            { day: 'Tue', cals: 1950, target: 2000 },
            { day: 'Wed', cals: 2040, target: 2000 },
            { day: 'Thu', cals: 1780, target: 2000 },
            { day: 'Fri', cals: 1910, target: 2000 },
            { day: 'Sat', cals: 2150, target: 2000 },
            { day: 'Sun', cals: 1890, target: 2000 }
          ].map((bar, i) => {
            const heightPct = Math.min(Math.round((bar.cals / 2500) * 100), 100);
            const isOver = bar.cals > bar.target;

            return (
              <div key={i} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-bold text-[#5B6B7A] group-hover:text-[#2E2E2E] dark:group-hover:text-white mb-1 transition-colors">
                  {bar.cals}
                </span>
                <div className="w-full max-w-[42px] bg-stone-100 dark:bg-slate-700 rounded-xl h-36 flex items-end overflow-hidden p-1">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      isOver ? 'bg-[#D4A85A]' : 'bg-[#C75A3B]'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[#2E2E2E] dark:text-white mt-2">
                  {bar.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grocery Spend vs Health Composition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
          <h3 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
            Grocery Spend by Nutritional Category
          </h3>
          <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
            Extracted from your scanned receipts (Reliance Fresh, Blinkit, Local Mandi).
          </p>

          <div className="space-y-3 pt-2">
            {[
              { category: 'Fresh Produce (Vegetables & Fruits)', pct: 42, inr: 1785, color: 'bg-[#2E7D6B]' },
              { category: 'Lean Proteins & Dairy (Chicken, Eggs, Paneer)', pct: 34, inr: 1445, color: 'bg-[#C75A3B]' },
              { category: 'Whole Grains & Dals (Rice, Atta, Moong)', pct: 16, inr: 680, color: 'bg-[#D4A85A]' },
              { category: 'Packaged / Ultra-Processed Snacks', pct: 8, inr: 340, color: 'bg-[#5B6B7A]' }
            ].map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#2E2E2E] dark:text-white">{cat.category}</span>
                  <span className="font-bold">₹{cat.inr} ({cat.pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-slate-700 overflow-hidden">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bite Currency & Milestone Achievements */}
        <div className="bg-[#FAF8F4] dark:bg-slate-800/60 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#D4A85A]" />
              <span>Milestone Achievements</span>
            </h3>
            <span className="text-xs font-bold text-[#D4A85A]">
              1,240 Bite Coins
            </span>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Protein Powerhouse', desc: 'Hit daily protein target 5 days in a row', completed: true },
              { title: 'Smart Shopper', desc: 'Maintained grocery spend below ₹6,000 budget', completed: true },
              { title: 'Vegetable Champion', desc: 'Consumed 400g+ fresh produce 4 times this week', completed: true },
              { title: 'Zero Waste Pantry', desc: 'Cooked 3 recipes from expiring pantry stock', completed: false }
            ].map((m, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-[#E8E6E1] dark:border-slate-700 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#2E2E2E] dark:text-white">{m.title}</h4>
                  <p className="text-[11px] text-[#5B6B7A] dark:text-slate-400">{m.desc}</p>
                </div>
                {m.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D6B] shrink-0" />
                ) : (
                  <span className="text-[10px] font-bold text-[#5B6B7A] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-slate-700">
                    In Progress
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
