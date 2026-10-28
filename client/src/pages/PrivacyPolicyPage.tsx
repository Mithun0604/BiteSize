import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onNavigate: (page: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <button
        onClick={() => onNavigate('landing')}
        className="text-xs font-semibold text-[#5B6B7A] hover:text-[#C75A3B] flex items-center space-x-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      <div className="space-y-2">
        <div className="section-eyebrow">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy & Data Protection</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E2E2E] dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
          Last updated: October 2026 • Compliant with Indian DPDP Act & Global Privacy Standards
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-6 text-xs text-[#5B6B7A] dark:text-slate-300 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
            1. Our Core Privacy Philosophy
          </h2>
          <p>
            At BiteSize, we believe your food choices, dietary preferences, and grocery spending are deeply personal. We operate on a simple principle: <strong>your data serves your health, not third-party ad brokers</strong>. We never sell your receipts, pantry logs, or meal photos to packaged food corporations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
            2. Information We Collect
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Account Details:</strong> Full name, email address, and encrypted password hash (bcrypt).</li>
            <li><strong>Health & Nutrition Profile:</strong> Age, height, weight, dietary preferences (vegetarian, non-veg, vegan), known food allergies, and fitness targets.</li>
            <li><strong>Meal Photos & Scans:</strong> Images captured or uploaded to identify foods and portion sizes.</li>
            <li><strong>Grocery Receipts:</strong> Scanned receipts or digital invoices used to extract purchased items, quantities, categories, and prices.</li>
            <li><strong>Pantry & Shopping Lists:</strong> Ingredients you track in your home pantry or active shopping list.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
            3. How We Use Your Data
          </h2>
          <p>
            Your information is strictly processed to:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Extract nutritional macros (calories, protein, carbs, fats, fiber) against verified ICMR-NIN IFCT tables.</li>
            <li>Analyze grocery spending by category and calculate Bite Currency cashback rewards.</li>
            <li>Power the AI Coach to answer questions about your meal balance and pantry stock.</li>
            <li>Calculate progress indicators towards your monthly health and grocery budget goals.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
            4. Image Processing & AI Vision
          </h2>
          <p>
            When you upload a meal photo or grocery receipt, the image is processed using secure computer vision algorithms solely to extract food and price items. We do not use your personal meal photos to train public generative AI models without explicit, opt-in consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
            5. Data Retention & Your Rights
          </h2>
          <p>
            You maintain full ownership of your data at all times:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Export Your Data:</strong> You can export your entire nutrition history, receipts, and meal logs in CSV or JSON format at any time from your account settings.</li>
            <li><strong>Account Deletion:</strong> You can permanently delete your account and all associated databases with a single click in Profile Settings.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
            6. Contact the Data Protection Officer
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or your data, email our Data Protection team at{' '}
            <a href="mailto:privacy@bitesize.app" className="font-bold text-[#C75A3B] underline">
              privacy@bitesize.app
            </a>.
          </p>
        </section>

      </div>

    </div>
  );
};
