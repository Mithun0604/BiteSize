import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface UncertaintyBadgeProps {
  uncertaintyRange?: string; // e.g. "±10%"
  confidenceScore?: number; // e.g. 0.92
  isVerifiedLabel?: boolean;
}

export const UncertaintyBadge: React.FC<UncertaintyBadgeProps> = ({
  uncertaintyRange = '±12%',
  confidenceScore = 0.90,
  isVerifiedLabel = false
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (isVerifiedLabel) {
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#2E7D6B]/10 text-[#2E7D6B] border border-[#2E7D6B]/20">
        <CheckCircle2 className="w-3 h-3" />
        <span>Verified Nutrition Label</span>
      </span>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FAF8F4] text-[#5B6B7A] border border-[#E8E6E1] hover:border-[#C75A3B] transition-colors"
      >
        <AlertTriangle className="w-3 h-3 text-[#E3B341]" />
        <span>AI Estimate ({uncertaintyRange})</span>
        <HelpCircle className="w-3 h-3 text-[#5B6B7A]/70" />
      </button>

      {showTooltip && (
        <div className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#2E2E2E] text-white text-xs rounded-xl shadow-xl pointer-events-none">
          <p className="font-semibold text-[#F6D6C9] mb-1">Honest AI Calibration</p>
          <p className="text-[11px] text-stone-300 leading-snug">
            Single food photos cannot capture hidden fats, cooking gravies, or exact density. BiteSize applies confidence-calibrated IFCT tables ({Math.round(confidenceScore * 100)}% visual match) with an estimated variance of {uncertaintyRange}.
          </p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2E2E2E]"></div>
        </div>
      )}
    </div>
  );
};
