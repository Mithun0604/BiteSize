import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { ArrowRight, Lock, Mail, User, AlertCircle, Heart } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('vegetarian');
  const [fitnessGoal, setFitnessGoal] = useState('balanced_health');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authApi.register({
        fullName,
        email,
        password,
        dietaryPreference,
        fitnessGoal
      });

      if (res.success) {
        login(res.token, res.user);
        onNavigate('dashboard');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-lg w-full space-y-8 bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-[#C75A3B] to-[#E8987F] flex items-center justify-center shadow-md shadow-[#C75A3B]/20">
            <span className="font-serif font-bold text-white text-xl">B</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white">Start with BiteSize</h2>
          <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
            Set up your free Small Bite plan in 30 seconds. No credit card required.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-[#D96B6B] flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#5B6B7A] dark:text-slate-300 mb-1">
              Your Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#5B6B7A] absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#5B6B7A] dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#5B6B7A] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="aarav@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#5B6B7A] dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#5B6B7A] absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-[#5B6B7A] dark:text-slate-300 mb-1">
                Dietary Preference
              </label>
              <select
                value={dietaryPreference}
                onChange={e => setDietaryPreference(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B]"
              >
                <option value="vegetarian">Vegetarian (Lacto)</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="non_veg">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="jain">Jain Friendly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5B6B7A] dark:text-slate-300 mb-1">
                Primary Goal
              </label>
              <select
                value={fitnessGoal}
                onChange={e => setFitnessGoal(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B]"
              >
                <option value="balanced_health">Balanced Nutrition & Spend</option>
                <option value="muscle_gain">High Protein / Muscle Recovery</option>
                <option value="weight_loss">Calorie Deficit / Weight Control</option>
                <option value="high_fiber">High Fiber / Gut Health</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-xs bg-[#C75A3B] text-white hover:bg-[#b0482b] transition-all flex items-center justify-center space-x-2 shadow-md shadow-[#C75A3B]/25"
          >
            <span>{loading ? 'Creating Your Profile...' : 'Complete Free Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#5B6B7A] dark:text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-[#C75A3B] font-semibold hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
