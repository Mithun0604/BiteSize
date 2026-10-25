import React from 'react';
import { Utensils, Home, Camera, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  onNavigate: (page: string) => void;
}

export const NotFoundPage: React.FC<NotFoundProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#C75A3B]/10 text-[#C75A3B] flex items-center justify-center mx-auto shadow-sm">
          <Utensils className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C75A3B]">
            404 • Page Not Found
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E2E2E] dark:text-white">
            Looks Like That Bite is Missing
          </h1>
          <p className="text-xs sm:text-sm text-[#5B6B7A] dark:text-slate-400">
            The page you are looking for has either been moved, renamed, or doesn't exist in our pantry.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#C75A3B] text-white hover:bg-[#b0482b] flex items-center space-x-2 shadow-md shadow-[#C75A3B]/20"
          >
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('scan-meal')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-[#E8E6E1] dark:border-slate-700 text-[#2E2E2E] dark:text-white hover:border-[#C75A3B] flex items-center space-x-2"
          >
            <Camera className="w-4 h-4" />
            <span>Scan a Meal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
