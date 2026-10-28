import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Send, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

interface HelpProps {
  onNavigate: (page: string) => void;
}

export const HelpFAQPage: React.FC<HelpProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const faqs = [
    {
      q: "How does the Meal Photo Scanner help with nutrition logging?",
      a: "A food image classifier suggests a category from your photo. It cannot identify every ingredient or portion, so you confirm or search for the food and set the portion yourself. Nutrition is calculated from BiteSize’s curated food database, and you can adjust added oil or sauce before saving."
    },
    {
      q: "How does the Grocery Receipt Scanner work?",
      a: "You can upload a receipt photo or PDF (from stores like Reliance Smart, DMart, Blinkit, or Zepto). BiteSize parses line items, quantities, prices, and discounts, categorizes them into aisles, and flags uncertain matches with yellow badges. Upon confirmation, items can be synced directly into your Pantry inventory."
    },
    {
      q: "What is Bite Currency and how is the 7.5% reward calculated?",
      a: "Bite Currency is our goal-oriented rewards program. When you reach monthly wellness milestones (e.g. logging 20 meals or staying within your grocery budget), you earn 7.5% of your eligible monthly grocery spend in Bite Currency, redeemable for organic and healthy staples through partner platform First Club."
    },
    {
      q: "What is the difference between Big Bite and Shared Bite?",
      a: "Big Bite is for individuals seeking unlimited scans, full AI Coach access, and 'What If?' comparisons. Shared Bite adds support for up to 5 family members under one shared household grocery budget and shared pantry, while keeping personal meal logs strictly private."
    },
    {
      q: "Is my personal nutrition data private and secure?",
      a: "Yes. BiteSize enforces user-specific database isolation and password hashing. We never sell identifiable meal or grocery logs to third parties. Household members in Shared Bite share the grocery budget, but cannot view each other's private meal intake without explicit consent."
    }
  ];

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setFeedbackText('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="section-eyebrow">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Help & Support Center</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E2E2E] dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6B7A] dark:text-slate-400">
          Everything you need to know about BiteSize nutrition intelligence, receipt OCR, and responsible AI.
        </p>
      </div>

      {/* FAQs Accordion */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-soft transition-all"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-[#2E2E2E] dark:text-white"
            >
              <span>{faq.q}</span>
              {openIndex === idx ? (
                <ChevronUp className="w-4 h-4 text-[#C75A3B] shrink-0 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#5B6B7A] shrink-0 ml-2" />
              )}
            </button>
            {openIndex === idx && (
              <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs text-[#5B6B7A] dark:text-slate-300 leading-relaxed border-t border-[#E8E6E1] dark:border-slate-700/50 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feedback & Contact Form */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-[#C75A3B]" />
          <h3 className="font-serif text-xl font-bold text-[#2E2E2E] dark:text-white">
            Send Feedback or Ask a Question
          </h3>
        </div>
        <p className="text-xs text-[#5B6B7A] dark:text-slate-400">
          Have an idea for a feature or need assistance with receipt scanning? Our team reads every message.
        </p>

        {feedbackSent ? (
          <div className="p-4 rounded-2xl bg-[#2E7D6B]/15 border border-[#2E7D6B]/30 text-xs text-[#2E7D6B] font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Thank you! Your feedback has been received by the BiteSize team.</span>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-3">
            <textarea
              required
              rows={3}
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              placeholder="Type your message, question, or feature idea here..."
              className="w-full p-3 text-xs rounded-xl border border-[#E8E6E1] dark:border-slate-600 bg-[#FAF8F4] dark:bg-slate-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#C75A3B] text-white hover:bg-[#b0482b] transition-transform hover:scale-105 flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Message</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
