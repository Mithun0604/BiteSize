import React, { useState, useEffect } from 'react';
import { mealApi, authApi } from '../services/api';
import { UncertaintyBadge } from '../components/UncertaintyBadge';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Camera,
  Flame,
  CheckCircle2,
  AlertCircle,
  UtensilsCrossed,
  Sun,
  Sunset,
  Moon,
  Coffee,
  Sparkles
} from 'lucide-react';

interface FoodDiaryProps {
  onNavigate: (page: string) => void;
}

export const FoodDiaryPage: React.FC<FoodDiaryProps> = ({ onNavigate }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [meals, setMeals] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  const [targets, setTargets] = useState<any>({ calories: 2000, protein: 75, carbs: 220, fat: 55, fiber: 30 });
  const [loading, setLoading] = useState(true);
  const [showManualModal, setShowManualModal] = useState(false);

  // Manual meal form
  const [manualName, setManualName] = useState('');
  const [manualType, setManualType] = useState('breakfast');
  const [manualGrams, setManualGrams] = useState(150);
  const [manualCalories, setManualCalories] = useState(250);
  const [manualProtein, setManualProtein] = useState(15);
  const [manualCarbs, setManualCarbs] = useState(25);
  const [manualFat, setManualFat] = useState(8);

  const fetchDayData = async (date: string) => {
    setLoading(true);
    try {
      const [mealRes, profileRes] = await Promise.all([
        mealApi.getMeals(date),
        authApi.getProfile()
      ]);

      if (mealRes.success) {
        setMeals(mealRes.meals || []);
        setTotals(mealRes.totals || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
      }

      if (profileRes.success && profileRes.profile) {
        const p = profileRes.profile;
        setTargets({
          calories: p.calorie_target || 2000,
          protein: p.protein_target || 75,
          carbs: p.carb_target || 220,
          fat: p.fat_target || 55,
          fiber: p.fiber_target || 30
        });
      }
    } catch (err) {
      console.error('Failed to load food diary data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDayData(selectedDate);
  }, [selectedDate]);

  const changeDateByDays = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const handleDeleteMeal = async (id: number) => {
    if (!window.confirm('Delete this meal entry?')) return;
    try {
      await mealApi.deleteMeal(id);
      fetchDayData(selectedDate);
    } catch (err: any) {
      alert(err.message || 'Failed to delete meal');
    }
  };

  const handleSaveManualMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    try {
      await mealApi.confirmMeal({
        mealName: manualName.trim(),
        mealType: manualType,
        portionGrams: manualGrams,
        calories: Number(manualCalories),
        protein: Number(manualProtein),
        carbs: Number(manualCarbs),
        fat: Number(manualFat),
        fiber: 2,
        confidenceScore: 1.0,
        uncertaintyRange: 'Manual Log',
        cookingMethod: 'Homestyle',
        loggedDate: selectedDate
      });

      setShowManualModal(false);
      setManualName('');
      fetchDayData(selectedDate);
    } catch (err: any) {
      alert(err.message || 'Failed to save meal.');
    }
  };

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return <Coffee className="w-4 h-4 text-[#D4A85A]" />;
      case 'lunch':
        return <Sun className="w-4 h-4 text-[#C75A3B]" />;
      case 'dinner':
        return <Moon className="w-4 h-4 text-[#5B6B7A]" />;
      default:
        return <Sunset className="w-4 h-4 text-[#7FB3B8]" />;
    }
  };

  const mealsByType: Record<string, any[]> = {
    breakfast: meals.filter(m => m.meal_type === 'breakfast'),
    lunch: meals.filter(m => m.meal_type === 'lunch'),
    dinner: meals.filter(m => m.meal_type === 'dinner'),
    snack: meals.filter(m => m.meal_type === 'snack')
  };

  const caloriePct = Math.min(Math.round((totals.calories / (targets.calories || 1)) * 100), 100);
  const proteinPct = Math.min(Math.round((totals.protein / (targets.protein || 1)) * 100), 100);
  const carbPct = Math.min(Math.round((totals.carbs / (targets.carbs || 1)) * 100), 100);
  const fatPct = Math.min(Math.round((totals.fat / (targets.fat || 1)) * 100), 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Date Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C75A3B]/10 text-[#C75A3B] text-xs font-semibold">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Daily Nutrition & Food Diary</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white mt-1">
            Food Diary
          </h1>
          <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
            Track daily calorie balance, macro breakdown, and meal logging progress.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-[#E8E6E1] dark:border-slate-700 shadow-sm">
          <button
            onClick={() => changeDateByDays(-1)}
            className="p-2 rounded-xl text-[#5B6B7A] hover:bg-[#FAF8F4] dark:hover:bg-slate-700"
            title="Previous day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-2 px-2">
            <Calendar className="w-4 h-4 text-[#C75A3B]" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="text-xs font-bold bg-transparent text-[#2E2E2E] dark:text-white border-none focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => changeDateByDays(1)}
            className="p-2 rounded-xl text-[#5B6B7A] hover:bg-[#FAF8F4] dark:hover:bg-slate-700"
            title="Next day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
            className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-[#FAF8F4] dark:bg-slate-700 text-[#5B6B7A] hover:text-[#C75A3B]"
          >
            Today
          </button>
        </div>
      </div>

      {/* Daily Macro Progress Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#C75A3B] uppercase tracking-wider">
              Daily Target Adherence
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="font-serif text-3xl font-extrabold text-[#2E2E2E] dark:text-white">
                {totals.calories}
              </span>
              <span className="text-xs text-[#5B6B7A] dark:text-slate-400 font-semibold">
                / {targets.calories} kcal ({caloriePct}%)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('scan-meal')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C75A3B] text-white hover:bg-[#b0482b] flex items-center space-x-2 shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan Meal</span>
            </button>
            <button
              onClick={() => setShowManualModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 text-[#2E2E2E] dark:text-white border border-[#E8E6E1] dark:border-slate-600 hover:border-[#C75A3B] flex items-center space-x-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manual Entry</span>
            </button>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Protein */}
          <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#2E2E2E] dark:text-white">Protein</span>
              <span className="font-semibold text-[#C75A3B]">{totals.protein}g / {targets.protein}g</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-slate-600 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#C75A3B] transition-all duration-500"
                style={{ width: `${proteinPct}%` }}
              />
            </div>
            <p className="text-[10px] text-[#5B6B7A] dark:text-slate-400">{proteinPct}% of target</p>
          </div>

          {/* Carbs */}
          <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#2E2E2E] dark:text-white">Carbohydrates</span>
              <span className="font-semibold text-[#D4A85A]">{totals.carbs}g / {targets.carbs}g</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-slate-600 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#D4A85A] transition-all duration-500"
                style={{ width: `${carbPct}%` }}
              />
            </div>
            <p className="text-[10px] text-[#5B6B7A] dark:text-slate-400">{carbPct}% of target</p>
          </div>

          {/* Fats */}
          <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#2E2E2E] dark:text-white">Healthy Fats</span>
              <span className="font-semibold text-[#5B6B7A]">{totals.fat}g / {targets.fat}g</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-slate-600 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#5B6B7A] transition-all duration-500"
                style={{ width: `${fatPct}%` }}
              />
            </div>
            <p className="text-[10px] text-[#5B6B7A] dark:text-slate-400">{fatPct}% of target</p>
          </div>

          {/* Fiber */}
          <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#2E2E2E] dark:text-white">Dietary Fiber</span>
              <span className="font-semibold text-[#2E7D6B]">{totals.fiber}g / {targets.fiber}g</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-slate-600 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#2E7D6B] transition-all duration-500"
                style={{ width: `${Math.min(Math.round((totals.fiber / (targets.fiber || 1)) * 100), 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-[#5B6B7A] dark:text-slate-400">{totals.fiber}g logged</p>
          </div>
        </div>
      </div>

      {/* Meal Buckets (Breakfast, Lunch, Dinner, Snack) */}
      <div className="space-y-4">
        {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(type => {
          const typeMeals = mealsByType[type] || [];
          const typeCalories = typeMeals.reduce((acc, m) => acc + (m.calories || 0), 0);

          return (
            <div
              key={type}
              className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#E8E6E1] dark:border-slate-700 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-[#FAF8F4] dark:bg-slate-700">
                    {getMealTypeIcon(type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold capitalize text-[#2E2E2E] dark:text-white">
                      {type}
                    </h3>
                    <p className="text-[11px] text-[#5B6B7A] dark:text-slate-400">
                      {typeMeals.length} item{typeMeals.length !== 1 ? 's' : ''} logged
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-[#2E2E2E] dark:text-white">
                    {typeCalories} kcal
                  </span>
                  <button
                    onClick={() => {
                      setManualType(type);
                      setShowManualModal(true);
                    }}
                    className="p-1.5 rounded-lg text-[#5B6B7A] hover:text-[#C75A3B] hover:bg-[#FAF8F4] dark:hover:bg-slate-700"
                    title="Add food to this meal"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {typeMeals.length === 0 ? (
                <p className="text-xs text-[#5B6B7A] dark:text-slate-400 py-3 text-center italic">
                  No meals logged for {type} on this date.
                </p>
              ) : (
                <div className="space-y-2">
                  {typeMeals.map(meal => (
                    <div
                      key={meal.id}
                      className="p-3.5 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/40 border border-[#E8E6E1] dark:border-slate-600 flex items-center justify-between gap-3 hover:border-[#C75A3B]/40 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-[#2E2E2E] dark:text-white">
                            {meal.meal_name}
                          </span>
                          {meal.is_ai_estimated ? (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-[#5B6B7A]/15 text-[#5B6B7A]">
                              AI Scan {meal.uncertainty_range}
                            </span>
                          ) : (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-[#2E7D6B]/15 text-[#2E7D6B]">
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#5B6B7A] dark:text-slate-300">
                          {meal.portion_grams}g • {meal.calories} kcal • {meal.protein}g protein • {meal.carbs}g carbs • {meal.fat}g fat
                          {meal.cooking_method ? ` • ${meal.cooking_method}` : ''}
                        </p>
                        {meal.notes && (
                          <p className="text-[10px] text-stone-500 italic">"{meal.notes}"</p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => handleDeleteMeal(meal.id)}
                          className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Manual Meal Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8E6E1] dark:border-slate-700 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-[#E8E6E1] dark:border-slate-700 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">
                Quick Log Meal
              </h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveManualMeal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1">
                  Food / Dish Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grilled Chicken Breast with Broccoli"
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1">
                    Meal Type
                  </label>
                  <select
                    value={manualType}
                    onChange={e => setManualType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#2E2E2E] dark:text-white"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1">
                    Portion (grams)
                  </label>
                  <input
                    type="number"
                    value={manualGrams}
                    onChange={e => setManualGrams(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#2E2E2E] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5B6B7A]">Calories</label>
                  <input
                    type="number"
                    value={manualCalories}
                    onChange={e => setManualCalories(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs text-center rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5B6B7A]">Protein (g)</label>
                  <input
                    type="number"
                    value={manualProtein}
                    onChange={e => setManualProtein(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs text-center rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5B6B7A]">Carbs (g)</label>
                  <input
                    type="number"
                    value={manualCarbs}
                    onChange={e => setManualCarbs(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs text-center rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5B6B7A]">Fat (g)</label>
                  <input
                    type="number"
                    value={manualFat}
                    onChange={e => setManualFat(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs text-center rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5B6B7A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#C75A3B] text-white hover:bg-[#b0482b]"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
