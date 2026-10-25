import React, { useState } from 'react';
import { authApi } from '../services/api';
import {
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

interface ForgotPasswordProps {
  onNavigate: (page: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await authApi.forgotPassword(email.trim());
      if (res.success) {
        setResetToken(res.resetToken || 'demo_token');
        setStep(2);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authApi.resetPassword({
        email: email.trim(),
        newPassword,
        resetToken
      });

      if (res.success) {
        setSuccessMsg('Your password has been successfully reset! Redirecting to login...');
        setTimeout(() => {
          onNavigate('login');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#C75A3B]/10 text-[#C75A3B] flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white">
            {step === 1 ? 'Reset Your Password' : 'Enter New Password'}
          </h2>
          <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
            {step === 1
              ? 'Enter the email linked to your BiteSize account to reset your credentials.'
              : `Create a strong new password for ${email}.`}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-[#D96B6B] flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-[#2E7D6B]/15 border border-[#2E7D6B]/30 text-xs text-[#2E7D6B] font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. demo@bitesize.app"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-xs bg-[#C75A3B] text-white hover:bg-[#b0482b] shadow-md shadow-[#C75A3B]/20 transition-transform hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Verifying Email...' : 'Continue to Reset Password'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-xs bg-[#C75A3B] text-white hover:bg-[#b0482b] shadow-md shadow-[#C75A3B]/20 transition-transform hover:scale-[1.02]"
            >
              {loading ? 'Updating Password...' : 'Save New Password & Sign In'}
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('login')}
            className="text-xs font-semibold text-[#5B6B7A] hover:text-[#C75A3B] flex items-center justify-center space-x-1.5 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Login</span>
          </button>
        </div>

      </div>
    </div>
  );
};
