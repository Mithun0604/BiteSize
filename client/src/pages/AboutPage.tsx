import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Heart,
  Scale,
  Users,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface AboutProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="section-eyebrow">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The BiteSize Story</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2E2E2E] dark:text-white leading-tight">
          Bridging the Gap Between What You Buy and What You Fuel.
        </h1>
        <p className="text-sm sm:text-base text-[#5B6B7A] dark:text-slate-400 leading-relaxed">
          Most nutrition apps ask you to guess portions and type in endless logs. Most budget apps just tell you how much you spent. BiteSize unites both: turning raw grocery receipts and meal photos into actionable, honest health intelligence.
        </p>
      </div>

      {/* Mission & Brand Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#C75A3B]/10 text-[#C75A3B] flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">
            Uncompromising Accuracy
          </h3>
          <p className="text-xs text-[#5B6B7A] dark:text-slate-400 leading-relaxed">
            We never invent nutritional numbers. Every macro estimate is calibrated against ICMR-NIN Indian Food Composition Tables and USDA FoodData Central with transparent uncertainty ranges.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2E7D6B]/15 text-[#2E7D6B] flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">
            Better Food, Smarter Spending
          </h3>
          <p className="text-xs text-[#5B6B7A] dark:text-slate-400 leading-relaxed">
            Good health shouldn't bankrupt your household. Our "What If?" simulator proves that switching to nutritious staples like makhana and moong sprouts actually saves ₹400+ per trip.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5B6B7A]/15 text-[#5B6B7A] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">
            Zero Data Monetization
          </h3>
          <p className="text-xs text-[#5B6B7A] dark:text-slate-400 leading-relaxed">
            Your receipts, pantry inventory, and meal photos belong to you. We do not sell your grocery buying patterns to packaged food conglomerates or third-party ad brokers.
          </p>
        </div>
      </div>

      {/* Scientific Foundation Details */}
      <div className="bg-[#FAF8F4] dark:bg-slate-800/60 rounded-3xl p-8 border border-[#E8E6E1] dark:border-slate-700 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-[#C75A3B] text-white">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white">
              Grounded in Nutritional Science
            </h3>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
              Indian Food Composition Tables (IFCT) & USDA FoodData Central
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#5B6B7A] dark:text-slate-300 leading-relaxed">
          <div className="space-y-3">
            <h4 className="font-bold text-[#2E2E2E] dark:text-white text-sm">
              Why Indian Food Composition (IFCT) Matters
            </h4>
            <p>
              Standard global nutrition databases fail when analyzing Indian diets. A bowl of yellow dal cooked with ghee tadka, or whole wheat atta roti vs maida flatbread have dramatically different glycemic indices and nutrient densities.
            </p>
            <p>
              BiteSize references the National Institute of Nutrition (ICMR-NIN) 2017/2024 database, mapping over 500 indigenous grains, pulses, millets, spices, and cooking fat variations.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-[#2E2E2E] dark:text-white text-sm">
              The Reality of AI Precision
            </h4>
            <p>
              No computer vision model can definitively tell if a cooked chicken breast was roasted in 1 teaspoon of olive oil or 2 tablespoons of butter simply by looking at pixels.
            </p>
            <p>
              That is why BiteSize pioneered <strong>Transparent Uncertainty Indicators (±9% to ±14%)</strong> and interactive clarification prompts: giving you verified control over what goes into your body.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center p-8 rounded-3xl bg-gradient-to-r from-[#C75A3B] to-[#E8987F] text-white space-y-4 shadow-xl">
        <h3 className="font-serif text-3xl font-bold">
          Ready to Understand Your Food and Spend Smarter?
        </h3>
        <p className="text-xs sm:text-sm text-white/90 max-w-xl mx-auto">
          Join thousands of mindful eaters who track both nutrition and groceries with BiteSize.
        </p>
        <button
          onClick={() => onNavigate('register')}
          className="px-8 py-3.5 rounded-xl font-bold text-xs bg-white text-[#C75A3B] hover:bg-stone-100 shadow-md transition-transform hover:scale-105"
        >
          Create Free Small Bite Account
        </button>
      </div>

    </div>
  );
};
