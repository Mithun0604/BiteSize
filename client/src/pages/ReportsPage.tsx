import React, { useState, useEffect } from 'react';
import { reportsApi } from '../services/api';
import { BarChart3, Download, Calendar, TrendingUp, DollarSign, Activity } from 'lucide-react';

interface ReportsProps {
  onNavigate: (page: string) => void;
}

export const ReportsPage: React.FC<ReportsProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await reportsApi.getAnalytics();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.warn("Could not load analytics report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExport = (format: 'json' | 'csv') => {
    window.open(reportsApi.exportDataUrl(format), '_blank');
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-[#5B6B7A]">Compiling nutrition & spend reports...</div>;
  }

  const { nutritionTrends, categorySpendTotal, storeSpendTotal, totalSpendAllTime, totalMealsLogged } = data || {};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E6E1] dark:border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#5B6B7A]/10 text-[#5B6B7A] text-xs font-semibold">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Intelligence & Exportable Analytics</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white mt-1">
            Nutrition & Spending Reports
          </h1>
          <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
            Long-term dietary patterns, category expenditure, and privacy-respecting personal data exports.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#C75A3B] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#5B6B7A]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport('json')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#2E2E2E] text-white hover:bg-black transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#5B6B7A]">Total Grocery Spend</span>
          <p className="text-3xl font-black text-[#2E2E2E] dark:text-white">
            ₹{totalSpendAllTime?.toLocaleString('en-IN') || 0}
          </p>
          <span className="text-[11px] text-[#2E7D6B] font-semibold">Tracked across verified receipts</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#5B6B7A]">Total Meals Photographed</span>
          <p className="text-3xl font-black text-[#C75A3B]">
            {totalMealsLogged || 0}
          </p>
          <span className="text-[11px] text-[#5B6B7A]">Calibrated via IFCT database</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#5B6B7A]">Bite Currency Return</span>
          <p className="text-3xl font-black text-[#D4A85A]">
            7.5%
          </p>
          <span className="text-[11px] text-[#5B6B7A]">Reward rate on eligible spend</span>
        </div>
      </div>

      {/* 1. Daily Intake Trends Table & Visual Bars */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
        <h3 className="font-serif text-xl font-bold text-[#2E2E2E] dark:text-white">
          Daily Caloric & Protein Intake Patterns
        </h3>

        <div className="space-y-3">
          {nutritionTrends?.map((trend: any) => (
            <div
              key={trend.date}
              className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#2E2E2E] dark:text-white">{trend.date}</span>
                <p className="text-[11px] text-[#5B6B7A]">
                  {trend.mealCount} meal(s) • {Math.round(trend.calories)} kcal • {Math.round(trend.protein)}g Protein
                </p>
              </div>

              <div className="flex items-center space-x-6 text-xs font-semibold">
                <div>
                  <span className="text-[10px] text-[#5B6B7A] block">Carbs</span>
                  <span>{Math.round(trend.carbs)}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5B6B7A] block">Fats</span>
                  <span>{Math.round(trend.fat)}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5B6B7A] block">Fiber</span>
                  <span className="text-[#2E7D6B]">{Math.round(trend.fiber)}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Category Spending Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">
            Expenditure by Food Category
          </h3>
          <div className="space-y-2">
            {Object.entries(categorySpendTotal || {}).map(([cat, amt]: any) => (
              <div key={cat} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F4] dark:bg-slate-700/50 text-xs">
                <span className="font-medium text-[#2E2E2E] dark:text-white">{cat}</span>
                <span className="font-bold text-[#C75A3B]">₹{Math.round(amt)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">
            Supermarket & Platform Distribution
          </h3>
          <div className="space-y-2">
            {Object.entries(storeSpendTotal || {}).map(([store, amt]: any) => (
              <div key={store} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F4] dark:bg-slate-700/50 text-xs">
                <span className="font-medium text-[#2E2E2E] dark:text-white">{store}</span>
                <span className="font-bold text-[#2E7D6B]">₹{Math.round(amt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
