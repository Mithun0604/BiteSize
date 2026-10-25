import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  HelpCircle,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';

interface ContactProps {
  onNavigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C75A3B]/10 text-[#C75A3B] text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>We're Here to Help</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E2E2E] dark:text-white">
          Get in Touch with BiteSize
        </h1>
        <p className="text-xs sm:text-sm text-[#5B6B7A] dark:text-slate-400">
          Have a question about food scanner accuracy, subscription billing, or recipe recommendations? Drop us a note.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Support Information */}
        <div className="space-y-6 md:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-4">
            <h3 className="font-serif text-base font-bold text-[#2E2E2E] dark:text-white">
              Contact Details
            </h3>

            <div className="space-y-3 text-xs text-[#5B6B7A] dark:text-slate-300">
              <div className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-[#C75A3B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-[#2E2E2E] dark:text-white">Email Us</span>
                  <a href="mailto:support@bitesize.app" className="hover:underline">
                    support@bitesize.app
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-[#C75A3B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-[#2E2E2E] dark:text-white">Response Times</span>
                  <span>Monday - Saturday<br />9:00 AM – 7:00 PM IST<br />(Within 4 hours)</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#C75A3B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-[#2E2E2E] dark:text-white">HQ</span>
                  <span>Bangalore & Mumbai, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F4] dark:bg-slate-800/60 border border-[#E8E6E1] dark:border-slate-700 text-xs text-[#5B6B7A] dark:text-slate-400 space-y-2">
            <h4 className="font-bold text-[#2E2E2E] dark:text-white">Instant Answers</h4>
            <p>Looking for how BiteSize calculates uncertainty ranges or handles receipt OCR?</p>
            <button
              onClick={() => onNavigate('help')}
              className="font-bold text-[#C75A3B] hover:underline block pt-1"
            >
              Explore Help & FAQ →
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-[#E8E6E1] dark:border-slate-700 shadow-soft space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#2E2E2E] dark:text-white">
              Send Us a Message
            </h3>

            {submitted && (
              <div className="p-4 rounded-2xl bg-[#2E7D6B]/15 border border-[#2E7D6B]/30 text-xs text-[#2E7D6B] font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! Your message has been received. Our support team will reply within 4 hours.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mithun Krishna"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1">
                  Topic / Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#2E2E2E] dark:text-white"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Food Scanner Accuracy">Food Scanner & Vision Accuracy</option>
                  <option value="Receipt OCR Issue">Receipt OCR & Categorization</option>
                  <option value="Subscription & Billing">Subscription & Razorpay Billing</option>
                  <option value="Feature Request">Feature Request / Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5B6B7A] dark:text-slate-300 mb-1">
                  How can we help?
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tell us what you need help with..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B]"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs bg-[#C75A3B] text-white hover:bg-[#b0482b] shadow-md shadow-[#C75A3B]/20 transition-transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};
