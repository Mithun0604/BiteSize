import React, { useState, useEffect } from 'react';
import { authApi } from '../services/api';
import {
  Target,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Shield,
  Heart,
  Save,
  DollarSign,
  Utensils
} from 'lucide-react';

interface GoalsPreferencesProps {
  onNavigate: (page: string) => void;
}

export const GoalsPreferencesPage: React.FC<GoalsPreferencesProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profile and Goal state
  const [fitnessGoal, setFitnessGoal] = useState<string>('muscle_gain');
  const [calorieTarget, setCalorieTarget] = useState<number>(2000);
  const [proteinTarget, setProteinTarget] = useState<number>(85);
  const [carbTarget, setCarbTarget] = useState<number>(210);
  const [fatTarget, setFatTarget] = useState<number>(55);
  const [fiberTarget, setFiberTarget] = useState<number>(30);
  const [dietaryPreference, setDietaryPreference] = useState<string>('non_veg');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(6000);

  const allergyOptions = [
    'Dairy / Lactose',
    'Gluten / Wheat',
    'Peanuts / Tree Nuts',
    'Shellfish / Seafood',
    'Soy / Soya Protein',
    'Eggs',
    'Mustard'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authApi.getProfile();
        if (res.success && res.profile) {
          const p = res.profile;
          setFitnessGoal(p.fitness_goal || 'muscle_gain');
          setCalorieTarget(p.calorie_target || 2000);
          setProteinTarget(p.protein_target || 85);
          setCarbTarget(p.carb_target || 210);
          setFatTarget(p.fat_target || 55);
          setFiberTarget(p.fiber_target || 30);
          setDietaryPreference(p.dietary_preference || 'non_veg');
          setSelectedAllergies(Array.isArray(p.allergies) ? p.allergies : []);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const toggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter(a => a !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  const handleApplyPreset = (preset: string) => {
    setFitnessGoal(preset);
    if (preset === 'muscle_gain') {
      setCalorieTarget(2250);
      setProteinTarget(120);
      setCarbTarget(240);
      setFatTarget(65);
      setFiberTarget(32);
    } else if (preset === 'fat_loss') {
      setCalorieTarget(1650);
      setProteinTarget(95);
      setCarbTarget(150);
      setFatTarget(45);
      setFiberTarget(35);
    } else if (preset === 'diabetic_friendly') {
      setCalorieTarget(1800);
      setProteinTarget(85);
      setCarbTarget(160);
      setFatTarget(50);
      setFiberTarget(40);
    } else {
      setCalorieTarget(2000);
      setProteinTarget(75);
      setCarbTarget(220);
      setFatTarget(55);
      setFiberTarget(30);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await authApi.updateProfile({
        fitnessGoal,
        calorieTarget: Number(calorieTarget),
        proteinTarget: Number(proteinTarget),
        carbTarget: Number(carbTarget),
        fatTarget: Number(fatTarget),
        fiberTarget: Number(fiberTarget),
        dietaryPreference,
        allergies: selectedAllergies,
        monthlyBudget: Number(monthlyBudget)
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update preferences.');
    } finally {
      setSaving(false);
    }
  };

  const calculatedCaloriesFromMacros = (proteinTarget * 4) + (carbTarget * 4) + (fatTarget * 9);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="section-eyebrow">
          <Target className="w-3.5 h-3.5" />
          <span>Personalization Engine</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white mt-1">
          Goals & Dietary Preferences
        </h1>
        <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
          Configure your daily caloric threshold, custom macronutrient distribution, allergies, and grocery budget limits.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#2E7D6B]/15 border border-[#2E7D6B]/30 text-xs text-[#2E7D6B] font-semibold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Preferences and nutritional targets updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Fitness Goal Presets */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
          <h3 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
            Primary Fitness & Health Goal
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'muscle_gain', title: 'Lean Muscle Gain', desc: 'Higher protein, surplus energy for hypertrophy' },
              { id: 'fat_loss', title: 'Fat Loss', desc: 'Caloric deficit, high fiber and lean protein' },
              { id: 'balanced_health', title: 'Balanced Health', desc: 'Maintenance calories, complete micronutrients' },
              { id: 'diabetic_friendly', title: 'Low Glycemic', desc: 'Controlled carbs, high fiber to stabilize glucose' }
            ].map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => handleApplyPreset(g.id)}
                className={`text-left p-4 rounded-2xl border text-xs transition-all ${
                  fitnessGoal === g.id
                    ? 'border-[#C75A3B] bg-[#C75A3B]/5 dark:bg-[#C75A3B]/10 ring-2 ring-[#C75A3B]/20'
                    : 'border-[#E8E6E1] dark:border-slate-700 hover:border-[#C75A3B]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#2E2E2E] dark:text-white">{g.title}</h4>
                  {fitnessGoal === g.id && <CheckCircle2 className="w-4 h-4 text-[#C75A3B]" />}
                </div>
                <p className="text-[11px] text-[#5B6B7A] dark:text-slate-400 mt-1">{g.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Nutritional Targets (Calories, Protein, Carbs, Fat, Fiber) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
              Daily Target Macronutrients
            </h3>
            <span className="text-xs text-[#5B6B7A] dark:text-slate-400">
              Computed from macros: <strong>{calculatedCaloriesFromMacros} kcal</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1">
                Calorie Target (kcal)
              </label>
              <input
                type="number"
                min="1000"
                max="5000"
                step="50"
                value={calorieTarget}
                onChange={e => setCalorieTarget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E2E2E] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1">
                Protein (grams)
              </label>
              <input
                type="number"
                min="30"
                max="300"
                value={proteinTarget}
                onChange={e => setProteinTarget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#C75A3B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1">
                Carbohydrates (g)
              </label>
              <input
                type="number"
                min="30"
                max="500"
                value={carbTarget}
                onChange={e => setCarbTarget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#D4A85A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1">
                Fats (grams)
              </label>
              <input
                type="number"
                min="10"
                max="200"
                value={fatTarget}
                onChange={e => setFatTarget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#5B6B7A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1">
                Fiber (grams)
              </label>
              <input
                type="number"
                min="15"
                max="60"
                value={fiberTarget}
                onChange={e => setFiberTarget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E7D6B]"
              />
            </div>
          </div>
        </div>

        {/* Dietary Preference & Food Allergies */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
          <h3 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
            Dietary Lifestyle & Food Allergies
          </h3>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300">
              Dietary Lifestyle
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'non_veg', label: 'Non-Vegetarian' },
                { id: 'eggetarian', label: 'Eggetarian' },
                { id: 'vegetarian', label: 'Vegetarian' },
                { id: 'vegan', label: 'Vegan' }
              ].map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDietaryPreference(d.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    dietaryPreference === d.id
                      ? 'bg-[#C75A3B] text-white border-[#C75A3B]'
                      : 'border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E2E2E] dark:text-white hover:border-[#C75A3B]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-2">
              Known Food Allergies (Flags unsafe recipe items)
            </label>
            <div className="flex flex-wrap gap-2">
              {allergyOptions.map(allergy => {
                const isSelected = selectedAllergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => toggleAllergy(allergy)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300'
                        : 'border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#5B6B7A] hover:border-[#C75A3B]'
                    }`}
                  >
                    {allergy} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Monthly Grocery Spending Target */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
              Monthly Grocery Budget Limit
            </h3>
            <span className="font-serif text-lg font-bold text-[#C75A3B]">
              ₹{monthlyBudget} / month
            </span>
          </div>
          <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
            BiteSize tracks receipt purchases against this spending ceiling and alerts you before budget overruns.
          </p>

          <input
            type="range"
            min="2000"
            max="25000"
            step="500"
            value={monthlyBudget}
            onChange={e => setMonthlyBudget(Number(e.target.value))}
            className="w-full accent-[#C75A3B] cursor-pointer"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl font-bold text-xs bg-[#C75A3B] text-white hover:bg-[#b0482b] shadow-lg shadow-[#C75A3B]/25 transition-transform hover:scale-105 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Goals & Preferences'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
