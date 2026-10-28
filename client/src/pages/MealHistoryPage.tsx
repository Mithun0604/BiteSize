import React, { useState, useEffect } from 'react';
import { mealApi } from '../services/api';
import {
  History,
  Search,
  Filter,
  Trash2,
  Calendar,
  Camera,
  Flame,
  ArrowRight,
  Sparkles,
  Utensils
} from 'lucide-react';

interface MealHistoryProps {
  onNavigate: (page: string) => void;
}

export const MealHistoryPage: React.FC<MealHistoryProps> = ({ onNavigate }) => {
  const [meals, setMeals] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await mealApi.getAllMeals(100, searchQuery);
      if (res.success) {
        setMeals(res.meals || []);
      }
    } catch (err) {
      console.error('Failed to load meal history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [searchQuery]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this meal entry from history?')) return;
    try {
      await mealApi.deleteMeal(id);
      fetchHistory();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const filteredMeals = meals.filter(m => {
    if (selectedType === 'all') return true;
    return m.meal_type === selectedType;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="section-eyebrow">
            <History className="w-3.5 h-3.5" />
            <span>Complete Meal Log Archive</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white mt-1">
            Meal History
          </h1>
          <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
            Searchable log of all analyzed and recorded meals, portion sizes, and macronutrient breakdowns.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('scan-meal')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#C75A3B] text-white hover:bg-[#b0482b] flex items-center space-x-2 shadow-md shadow-[#C75A3B]/20"
          >
            <Camera className="w-4 h-4" />
            <span>Scan New Meal</span>
          </button>
          <button
            onClick={() => onNavigate('diary')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-[#E8E6E1] dark:border-slate-700 text-[#2E2E2E] dark:text-white hover:border-[#C75A3B]"
          >
            Daily Food Diary
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#5B6B7A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by food name or notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Meals' },
            { id: 'breakfast', label: 'Breakfast' },
            { id: 'lunch', label: 'Lunch' },
            { id: 'dinner', label: 'Dinner' },
            { id: 'snack', label: 'Snacks' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedType(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedType === f.id
                  ? 'bg-[#C75A3B] text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-slate-700 text-[#5B6B7A] dark:text-slate-300 hover:text-[#2E2E2E]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Meal History List */}
      {loading ? (
        <div className="text-center py-12 text-xs text-[#5B6B7A]">
          Loading meal archive...
        </div>
      ) : filteredMeals.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-[#E8E6E1] dark:border-slate-700 space-y-3">
          <Utensils className="w-12 h-12 text-stone-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">
            No Meals Found
          </h3>
          <p className="text-xs text-[#5B6B7A] dark:text-slate-400 max-w-sm mx-auto">
            {searchQuery ? 'No meals matched your search query.' : 'You have not logged any meals yet. Try uploading a meal photo.'}
          </p>
          <button
            onClick={() => onNavigate('scan-meal')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#C75A3B] text-white hover:bg-[#b0482b]"
          >
            Scan Your First Meal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeals.map(meal => (
            <div
              key={meal.id}
              className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-[#E8E6E1] dark:border-slate-700 shadow-soft hover:border-[#C75A3B]/40 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  {meal.image_path ? (
                    <img
                      src={meal.image_path}
                      alt={meal.meal_name}
                      className="w-14 h-14 rounded-2xl object-cover border border-[#E8E6E1] shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700 flex items-center justify-center text-[#C75A3B] shrink-0">
                      <Utensils className="w-6 h-6" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 dark:bg-slate-700 text-[#5B6B7A]">
                        {meal.meal_type}
                      </span>
                      {meal.is_ai_estimated ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#5B6B7A]/15 text-[#5B6B7A]">
                          AI {meal.uncertainty_range}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#2E7D6B]/15 text-[#2E7D6B]">
                          Verified
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white mt-1">
                      {meal.meal_name}
                    </h3>
                    <p className="text-[11px] text-[#5B6B7A] dark:text-slate-400">
                      {meal.portion_grams}g portion • Logged on {meal.logged_date}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(meal.id)}
                  className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-50 dark:hover:bg-slate-700"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Nutrition Pills */}
              <div className="grid grid-cols-4 gap-2 text-center p-2.5 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 text-xs">
                <div>
                  <span className="block text-[10px] text-[#5B6B7A]">Calories</span>
                  <span className="font-bold text-[#2E2E2E] dark:text-white">{meal.calories} kcal</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#5B6B7A]">Protein</span>
                  <span className="font-bold text-[#C75A3B]">{meal.protein}g</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#5B6B7A]">Carbs</span>
                  <span className="font-bold text-[#D4A85A]">{meal.carbs}g</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#5B6B7A]">Fat</span>
                  <span className="font-bold text-[#5B6B7A]">{meal.fat}g</span>
                </div>
              </div>

              {meal.cooking_method && (
                <div className="text-[11px] text-[#5B6B7A] dark:text-slate-400 flex items-center justify-between">
                  <span>Cooking Method: <strong className="text-[#2E2E2E] dark:text-slate-200">{meal.cooking_method}</strong></span>
                  {meal.added_oil && meal.added_oil !== 'None' && (
                    <span>Oil: {meal.added_oil}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
