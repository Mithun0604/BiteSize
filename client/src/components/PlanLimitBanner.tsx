import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PlanLimitBannerProps {
  message: string;
  onUpgrade: () => void;
  onClose?: () => void;
}

export const PlanLimitBanner: React.FC<PlanLimitBannerProps> = ({ message, onUpgrade, onClose }) => {
  return (
    <div className="bg-gradient-to-r from-[#C75A3B] to-[#E07A5F] text-white p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 my-4 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-sm">Monthly Plan Fair-Use Limit Reached</h4>
          <p className="text-xs text-white/90 leading-relaxed">{message}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 shrink-0">
        {onClose && (
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-black/10 hover:bg-black/20 text-white transition-colors"
          >
            Dismiss
          </button>
        )}
        <button
          onClick={onUpgrade}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-[#C75A3B] hover:bg-[#FAF8F4] shadow transition-transform hover:scale-105"
        >
          <span>Upgrade to Big Bite</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
