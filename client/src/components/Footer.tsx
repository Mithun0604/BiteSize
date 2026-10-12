import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#2E2E2E] text-[#FAF8F4] pt-14 pb-10 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C75A3B] to-[#E8987F] flex items-center justify-center">
                <span className="font-serif font-bold text-white text-base">B</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">BiteSize</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Your groceries, understood. Connecting receipt OCR intelligence, precision meal recognition, and personalized AI coaching to eat well and spend wisely.
            </p>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-[#F6D6C9]">
              <span className="w-2 h-2 rounded-full bg-[#2E7D6B]"></span>
              <span>ICMR-NIN & IFCT Verified Database</span>
            </div>
          </div>

          {/* Core Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4A85A] mb-3">Intelligence</h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <button onClick={() => onNavigate('scan-meal')} className="hover:text-white transition-colors">
                  AI Meal Photo Scanner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('scan-receipt')} className="hover:text-white transition-colors">
                  Grocery Receipt OCR
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('coach')} className="hover:text-white transition-colors">
                  BiteSize AI Coach
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('what-if')} className="hover:text-white transition-colors">
                  "What If I Changed This?"
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pantry')} className="hover:text-white transition-colors">
                  Pantry-to-Plate AI
                </button>
              </li>
            </ul>
          </div>

          {/* Rewards & Business */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4A85A] mb-3">Rewards & Plans</h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <button onClick={() => onNavigate('rewards')} className="hover:text-white transition-colors">
                  Bite Currency (7.5% Reward)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('subscriptions')} className="hover:text-white transition-colors">
                  Small Bite (Free Plan)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('subscriptions')} className="hover:text-white transition-colors">
                  Big Bite (Individual Pro)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('family')} className="hover:text-white transition-colors">
                  Shared Bite (Family Plan)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rewards')} className="hover:text-white transition-colors">
                  First Club Partner Program
                </button>
              </li>
            </ul>
          </div>

          {/* Ethics & Responsible AI */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4A85A] mb-3">Responsible AI</h4>
            <p className="text-[11px] text-stone-400 leading-relaxed mb-3">
              Nutrition values are confidence-calibrated estimates calculated via ICMR-NIN IFCT & USDA databases. BiteSize does not substitute clinical advice or promote restrictive eating.
            </p>
            <div className="flex space-x-3 text-xs text-stone-400">
              <button onClick={() => onNavigate('help')} className="hover:text-white transition-colors">
                Privacy Policy
              </button>
              <span>•</span>
              <button onClick={() => onNavigate('help')} className="hover:text-white transition-colors">
                Terms of Service
              </button>
              <span>•</span>
              <button onClick={() => onNavigate('help')} className="hover:text-white transition-colors">
                Help & FAQ
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400">
          <p>© 2026 BiteSize Intelligence. All rights reserved. Made for Indian kitchens and mindful eaters.</p>
          <p className="mt-2 sm:mt-0">“Make every grocery choice count.”</p>
        </div>
      </div>
    </footer>
  );
};
