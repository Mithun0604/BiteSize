import React, { useState, useEffect } from 'react';
import { householdApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Plus, ShieldCheck, Lock, Trash2, CheckCircle2, UserPlus, Heart } from 'lucide-react';

interface FamilyProps {
  onNavigate: (page: string) => void;
}

export const FamilyPage: React.FC<FamilyProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [householdData, setHouseholdData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);

  // New member form
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Partner / Spouse');
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [dietary, setDietary] = useState('vegetarian');

  const fetchHousehold = async () => {
    setLoading(true);
    try {
      const res = await householdApi.getHousehold();
      if (res.success) {
        setHouseholdData(res);
      }
    } catch (err) {
      console.warn("Could not load household:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHousehold();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await householdApi.addMember({
        name: name.trim(),
        relation,
        dailyCalorieTarget: calorieTarget,
        dietaryPreference: dietary
      });

      if (res.success) {
        setName('');
        setShowAddMember(false);
        fetchHousehold();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add member.');
    }
  };

  const handleRemove = async (id: number) => {
    if (confirm("Remove this member from your household?")) {
      await householdApi.removeMember(id);
      fetchHousehold();
    }
  };

  const isSharedBite = user?.plan === 'shared_bite';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#5B6B7A]/10 text-[#5B6B7A] text-xs font-semibold">
          <Users className="w-3.5 h-3.5" />
          <span>Shared Bite Family Household</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white">
          Family Profiles & Shared Grocery Budget
        </h1>
        <p className="text-xs text-[#5B6B7A] dark:text-slate-400 max-w-2xl leading-relaxed">
          Manage family members under one shared household grocery budget and shared pantry, while keeping personal meal logs strictly private for individual nutritional goals.
        </p>
      </div>

      {!isSharedBite && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#5B6B7A] to-[#9CA8B7] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <h4 className="font-serif text-xl font-bold">Unlock Shared Bite Family Plan</h4>
            <p className="text-xs text-white/90">
              Add up to 5 family members, coordinate weekly grocery spending, and maintain individual health targets.
            </p>
          </div>
          <button
            onClick={() => onNavigate('subscriptions')}
            className="shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-[#5B6B7A] hover:bg-[#FAF8F4] shadow transition-transform hover:scale-105"
          >
            Upgrade to Shared Bite (₹399/mo)
          </button>
        </div>
      )}

      {/* Shared Budget Overview Card */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6B7A]">Household Grocery Budget</span>
          <p className="text-3xl font-black text-[#2E2E2E] dark:text-white mt-1">
            ₹{householdData?.sharedHouseholdBudget?.monthlyBudget?.toLocaleString('en-IN') || '12,000'}
          </p>
          <span className="text-xs text-[#5B6B7A]">Allocated for all family members</span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6B7A]">Shared Spending So Far</span>
          <p className="text-3xl font-black text-[#C75A3B] mt-1">
            ₹{householdData?.sharedHouseholdBudget?.totalSpend?.toLocaleString('en-IN') || '2,625'}
          </p>
          <span className="text-xs text-[#5B6B7A]">From combined grocery receipts</span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B6B7A]">Remaining Buffer</span>
          <p className="text-3xl font-black text-[#2E7D6B] mt-1">
            ₹{householdData?.sharedHouseholdBudget?.remaining?.toLocaleString('en-IN') || '9,375'}
          </p>
          <span className="text-xs text-[#2E7D6B] font-semibold">Healthy financial pace</span>
        </div>
      </div>

      {/* Household Members List */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2E2E2E] dark:text-white">
              Household Members
            </h3>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
              Each member receives custom calorie goals and dietary preference filtering.
            </p>
          </div>

          {isSharedBite && (
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#C75A3B] text-white hover:bg-[#b0482b]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          )}
        </div>

        {/* Add Member Form */}
        {showAddMember && (
          <form onSubmit={handleAddMember} className="p-5 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/60 border border-[#E8E6E1] dark:border-slate-600 grid grid-cols-1 sm:grid-cols-4 gap-3 animate-fade-in">
            <input
              type="text"
              required
              placeholder="Name (e.g. Priya Sharma)"
              value={name}
              onChange={e => setName(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-white dark:bg-slate-800"
            />
            <input
              type="text"
              placeholder="Relation (e.g. Sister, Child, Spouse)"
              value={relation}
              onChange={e => setRelation(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-white dark:bg-slate-800"
            />
            <select
              value={dietary}
              onChange={e => setDietary(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-white dark:bg-slate-800"
            >
              <option value="vegetarian">Vegetarian</option>
              <option value="eggetarian">Eggetarian</option>
              <option value="non_veg">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2E2E2E] text-white"
            >
              Save Member
            </button>
          </form>
        )}

        {/* Members Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Primary Owner Account */}
          <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#C75A3B] text-white font-bold flex items-center justify-center text-sm">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-xs text-[#2E2E2E] dark:text-white">{user?.fullName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-200 text-stone-700 font-semibold">Account Owner</span>
                </div>
                <span className="text-[11px] text-[#5B6B7A]">Primary Profile</span>
              </div>
            </div>
            <span title="Private personal nutrition log">
              <Lock className="w-4 h-4 text-[#2E7D6B]" />
            </span>
          </div>

          {householdData?.members?.map((m: any) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700/50 border border-[#E8E6E1] dark:border-slate-600 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#5B6B7A] text-white font-bold flex items-center justify-center text-sm">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-xs text-[#2E2E2E] dark:text-white">{m.name}</span>
                  <p className="text-[11px] text-[#5B6B7A]">{m.relation} • {m.dietary_preference} ({m.daily_calorie_target} kcal)</p>
                </div>
              </div>

              <button
                onClick={() => handleRemove(m.id)}
                className="text-stone-400 hover:text-red-500 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
