import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authApi.login({ email, password });
      if (res.success) {
        login(res.token, res.user, res.profile);
        onNavigate('dashboard');
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.login({ email: 'demo@bitesize.app', password: 'bitesize123' });
      if (res.success) {
        login(res.token, res.user, res.profile);
        onNavigate('dashboard');
      }
    } catch (err: any) {
      setError('Demo login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-[#C75A3B] to-[#E8987F] flex items-center justify-center shadow-md shadow-[#C75A3B]/20">
            <span className="font-serif font-bold text-white text-xl">B</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#2E2E2E] dark:text-white">Welcome back</h2>
          <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
            Log in to access your personal nutrition dashboard and grocery intelligence.
          </p>
        </div>

        {/* Quick Demo Access Pill */}
        <div className="p-3.5 rounded-2xl bg-[#F6D6C9]/40 border border-[#C75A3B]/20 text-center space-y-2">
          <div className="flex items-center justify-center space-x-1.5 text-xs font-semibold text-[#C75A3B]">
            <Sparkles className="w-4 h-4" />
            <span>Instant Demo Access</span>
          </div>
          <p className="text-[11px] text-[#5B6B7A] dark:text-slate-300">
            Explore with pre-seeded Reliance receipts, daily meals, pantry, and Bite Currency progress.
          </p>
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={loading}
            className="w-full py-2 rounded-xl text-xs font-bold bg-[#C75A3B] text-white hover:bg-[#b0482b] transition-all shadow-sm"
          >
            Sign In as Aarav (Demo User)
          </button>
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
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#5B6B7A] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-[#5B6B7A] dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-[11px] text-[#C75A3B] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#5B6B7A] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-xs bg-[#2E2E2E] dark:bg-slate-700 text-white hover:bg-black transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#5B6B7A] dark:text-slate-400">
          Don't have an account yet?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-[#C75A3B] font-semibold hover:underline"
          >
            Create free account
          </button>
        </div>
      </div>
    </div>
  );
};
