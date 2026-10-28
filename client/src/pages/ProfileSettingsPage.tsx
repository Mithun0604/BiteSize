import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { User, ShieldCheck, Heart, Trash2, CheckCircle2, AlertTriangle, Save, Target } from 'lucide-react';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export const ProfileSettingsPage: React.FC<ProfileProps> = ({ onNavigate }) => {
  const { user, profile, refreshProfile, logout } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('other');
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(68);
  const [activityLevel, setActivityLevel] = useState('moderately_active');
  const [dietaryPreference, setDietaryPreference] = useState('vegetarian');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('balanced_health');
  const [calorieTarget, setCalorieTarget] = useState(2100);
  const [proteinTarget, setProteinTarget] = useState(75);
  const [carbTarget, setCarbTarget] = useState(250);
  const [fatTarget, setFatTarget] = useState(60);
  const [fiberTarget, setFiberTarget] = useState(30);
  const [monthlyBudget, setMonthlyBudget] = useState(7500);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || user?.fullName?.split(' ')[0] || '');
      setAge(profile.age || 25);
      setGender(profile.gender || 'other');
      setHeightCm(profile.height_cm || 170);
      setWeightKg(profile.weight_kg || 68);
      setActivityLevel(profile.activity_level || 'moderately_active');
      setDietaryPreference(profile.dietary_preference || 'vegetarian');
      setAllergiesInput(profile.allergies ? profile.allergies.join(', ') : '');
      setFitnessGoal(profile.fitness_goal || 'balanced_health');
      setCalorieTarget(profile.calorie_target || 2100);
      setProteinTarget(profile.protein_target || 75);
      setCarbTarget(profile.carb_target || 250);
      setFatTarget(profile.fat_target || 60);
      setFiberTarget(profile.fiber_target || 30);
    }
  }, [profile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);

    const allergiesArray = allergiesInput
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    try {
      const res = await authApi.updateProfile({
        displayName,
        age: Number(age),
        gender,
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        activityLevel,
        dietaryPreference,
        allergies: allergiesArray,
        fitnessGoal,
        calorieTarget: Number(calorieTarget),
        proteinTarget: Number(proteinTarget),
        carbTarget: Number(carbTarget),
        fatTarget: Number(fatTarget),
        fiberTarget: Number(fiberTarget),
        monthlyBudget: Number(monthlyBudget)
      });

      if (res.success) {
        setSuccessMessage('Profile and nutrition targets successfully updated!');
        refreshProfile();
      }
    } catch (err: any) {
      alert("Failed to update profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("WARNING: Are you sure you want to delete your BiteSize account? All receipts, meal logs, and reward history will be permanently erased.")) {
      try {
        await authApi.deleteAccount();
        logout();
        onNavigate('landing');
      } catch (err) {
        alert("Failed to delete account.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="section-eyebrow">
          <User className="w-3.5 h-3.5" />
          <span>Personal Nutrition & Budget Settings</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white">
          Profile & Health Targets
        </h1>
        <p className="text-xs text-[#5B6B7A] dark:text-slate-400 max-w-2xl leading-relaxed">
          Calibrate your metabolic profile, food allergies, and monthly grocery budget. BiteSize uses these values to calculate calorie progress and personalized AI Coach recommendations.
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-[#2E7D6B]/15 border border-[#2E7D6B]/30 text-xs text-[#2E7D6B] font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-6">
        
        {/* Section 1: Personal Demographics */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white border-b border-[#E8E6E1] dark:border-slate-700 pb-2">
            1. Personal Demographics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] mb-1">Gender</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-900"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={e => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                value={weightKg}
                onChange={e => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Dietary Preferences & Allergies */}
        <div className="space-y-4 pt-2">
          <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white border-b border-[#E8E6E1] dark:border-slate-700 pb-2">
            2. Dietary Preferences & Safety Allergies
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] mb-1">Dietary Pattern</label>
              <select
                value={dietaryPreference}
                onChange={e => setDietaryPreference(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-900"
              >
                <option value="vegetarian">Vegetarian (Lacto)</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="non_veg">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="jain">Jain Friendly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] mb-1">
                Food Allergies (Comma separated, e.g. peanuts, shellfish)
              </label>
              <input
                type="text"
                value={allergiesInput}
                onChange={e => setAllergiesInput(e.target.value)}
                placeholder="peanuts, shellfish, lactose"
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Nutritional Targets & Grocery Budget */}
        <div className="space-y-4 pt-2">
          <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white border-b border-[#E8E6E1] dark:border-slate-700 pb-2">
            3. Daily Targets & Grocery Budget
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#5B6B7A] mb-1">Calories (kcal)</label>
              <input
                type="number"
                value={calorieTarget}
                onChange={e => setCalorieTarget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5B6B7A] mb-1">Protein (g)</label>
              <input
                type="number"
                value={proteinTarget}
                onChange={e => setProteinTarget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5B6B7A] mb-1">Carbs (g)</label>
              <input
                type="number"
                value={carbTarget}
                onChange={e => setCarbTarget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5B6B7A] mb-1">Fats (g)</label>
              <input
                type="number"
                value={fatTarget}
                onChange={e => setFatTarget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5B6B7A] mb-1">Fiber (g)</label>
              <input
                type="number"
                value={fiberTarget}
                onChange={e => setFiberTarget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5B6B7A] mb-1">
              Monthly Grocery Budget (₹ INR)
            </label>
            <input
              type="number"
              step="500"
              value={monthlyBudget}
              onChange={e => setMonthlyBudget(Number(e.target.value))}
              className="w-full max-w-xs px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-900"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-[#E8E6E1] dark:border-slate-700 flex items-center justify-between">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#C75A3B] text-white hover:bg-[#b0482b] transition-transform hover:scale-105 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>

      </form>

      {/* Danger Zone: Account Deletion */}
      <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-red-700 dark:text-red-400">Permanently Delete Account</h4>
          <p className="text-[11px] text-red-600/80 dark:text-red-400/80">
            Once deleted, all your receipt scans, meal photos, and Bite Currency will be permanently removed.
          </p>
        </div>
        <button
          onClick={handleDeleteAccount}
          className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          Delete Account
        </button>
      </div>

    </div>
  );
};
