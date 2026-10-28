import React from 'react';
import { FileText, ShieldAlert, CheckCircle2, ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onNavigate: (page: string) => void;
}

export const TermsOfServicePage: React.FC<TermsOfServiceProps> = ({ onNavigate }) => {
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
          <FileText className="w-3.5 h-3.5" />
          <span>User Agreement</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E2E2E] dark:text-white">
          Terms of Service
        </h1>
        <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
          Last updated: October 2026 • Please read these terms carefully before using BiteSize.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-6 text-xs text-[#5B6B7A] dark:text-slate-300 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By registering, accessing, or using the BiteSize platform (website, web applications, or associated APIs), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should discontinue use immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
            2. Medical & Health Disclaimer
          </h2>
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 space-y-1">
            <span className="font-bold block">Important Health Notice:</span>
            <p>
              BiteSize is an educational nutrition and grocery budget tracking tool. It is <strong>NOT</strong> a medical device and does NOT provide medical advice, diagnosis, or clinical dietary prescriptions. Always consult a registered dietitian, physician, or healthcare provider before undertaking significant dietary changes or clinical medical treatments.
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
            3. Accuracy & Uncertainty Standards
          </h2>
          <p>
            AI image analysis provides probabilistic estimates based on visual food characteristics. Calorie and macronutrient estimates carry calculated uncertainty indicators (e.g. ±9% to ±14%). Users are encouraged to verify portion weights and cooking fats to ensure optimal accuracy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
            4. Subscriptions, Payments & Cancellations
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Subscription Plans:</strong> Small Bite (Free), Big Bite (₹199/month or ₹1,999/year), Shared Bite (₹399/month or ₹3,999/year).</li>
            <li><strong>Auto-Renewal:</strong> Paid subscriptions renew automatically at the end of each billing cycle unless cancelled prior to renewal.</li>
            <li><strong>Cancellation:</strong> You may cancel your subscription at any time with 1 click in your profile settings. You will retain full access until the end of your prepaid period.</li>
            <li><strong>Refund Policy:</strong> We offer a 14-day money-back guarantee on all annual subscription purchases.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
            5. Bite Currency & Rewards Program
          </h2>
          <p>
            Bite Currency is an in-app reward earned through consistent receipt scanning, meeting nutrition goals, and purchasing nutritious groceries. Bite Coins have no independent cash surrender value and can be redeemed solely for partner vouchers and subscription discounts as outlined in the app.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
            6. Governing Law
          </h2>
          <p>
            These terms are governed by the laws of India. Any disputes arising from the use of BiteSize will be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka, India.
          </p>
        </section>

      </div>

    </div>
  );
};
