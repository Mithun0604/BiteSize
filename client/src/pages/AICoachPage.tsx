import React, { useState, useEffect, useRef } from 'react';
import { coachApi } from '../services/api';
import { Sparkles, Send, Trash2, HelpCircle, Bot, User, ShieldAlert } from 'lucide-react';

interface AICoachProps {
  onNavigate: (page: string) => void;
}

export const AICoachPage: React.FC<AICoachProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What can I cook with the groceries I have right now?",
    "How much have I spent on groceries this month?",
    "How can I increase my protein intake without exceeding my budget?",
    "Summarise my estimated nutrition intake today.",
    "What should I buy for next week's meals?"
  ];

  const fetchHistory = async () => {
    try {
      const res = await coachApi.getHistory();
      if (res.success && res.messages) {
        setMessages(res.messages);
      }
    } catch (err) {
      console.warn("Could not load coach history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (messageToSend?: string) => {
    const text = messageToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg = { id: Date.now(), role: 'user', message: text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await coachApi.sendMessage(text);
      if (res.success) {
        const assistantMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          message: res.reply
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          message: 'I apologize, but I am currently unable to fetch your live pantry context. Please try again in a moment.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (confirm("Clear your conversation history with BiteSize Coach?")) {
      await coachApi.clearHistory();
      setMessages([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex flex-col h-[85vh]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E6E1] dark:border-slate-800 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5B6B7A] to-[#9CA8B7] flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5 text-[#F6D6C9]" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#2E2E2E] dark:text-white">
              BiteSize AI Coach
            </h1>
            <p className="text-[11px] text-[#5B6B7A] dark:text-slate-400">
              Grounded in your actual receipts, pantry ingredients, calorie logs, and grocery budget.
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Medical & Accuracy Disclaimer Pill */}
      <div className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-[11px] text-[#2E2E2E] dark:text-amber-200 flex items-center space-x-2 shrink-0">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
        <span>
          <strong>Responsible Guidance:</strong> BiteSize Coach provides nutritional habit coaching. It does not provide medical diagnoses or replace licensed clinical advice.
        </span>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-3xl bg-white dark:bg-slate-800 border border-[#E8E6E1] dark:border-slate-700 shadow-soft">
        {messages.length === 0 ? (
          <div className="text-center py-12 space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F4] dark:bg-slate-700 text-[#C75A3B] flex items-center justify-center mx-auto">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2E2E2E] dark:text-white">
              How can I help you today?
            </h3>
            <p className="text-xs text-[#5B6B7A] dark:text-slate-400 leading-relaxed">
              I can check what ingredients you have in your pantry, advise on protein-to-cost efficiency, or check if you are within your monthly grocery budget.
            </p>

            {/* Suggested Question Pills */}
            <div className="flex flex-col space-y-2 pt-2 text-left">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="p-2.5 rounded-xl text-xs bg-[#FAF8F4] dark:bg-slate-700/60 hover:bg-[#F6D6C9]/40 dark:hover:bg-slate-600 text-[#2E2E2E] dark:text-slate-200 border border-[#E8E6E1] dark:border-slate-600 text-left transition-colors flex items-center justify-between"
                >
                  <span>{q}</span>
                  <span className="text-[#C75A3B] text-[10px] font-bold">Ask →</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(m => (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-[#5B6B7A] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4 text-[#F6D6C9]" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-[#C75A3B] text-white rounded-tr-none'
                    : 'bg-[#FAF8F4] dark:bg-slate-700/70 text-[#2E2E2E] dark:text-white border border-[#E8E6E1] dark:border-slate-600 rounded-tl-none'
                }`}
              >
                {m.message}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-stone-300 dark:bg-slate-600 text-[#2E2E2E] dark:text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-[#5B6B7A] p-2">
            <Sparkles className="w-4 h-4 animate-spin text-[#C75A3B]" />
            <span>Analyzing pantry ingredients, recent receipts, and budget...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Pills above input */}
      {messages.length > 0 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
          {suggestedQuestions.slice(0, 3).map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="shrink-0 px-3 py-1 rounded-full text-[11px] bg-white dark:bg-slate-800 text-[#5B6B7A] dark:text-slate-300 border border-[#E8E6E1] dark:border-slate-700 hover:border-[#C75A3B] transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Ask BiteSize AI Coach about meals, calories, protein, or grocery spending..."
          className="flex-1 px-4 py-3 rounded-2xl text-xs border border-[#E8E6E1] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#2E2E2E] dark:text-white focus:outline-none focus:border-[#C75A3B] shadow-sm"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="p-3 rounded-2xl bg-[#C75A3B] text-white hover:bg-[#b0482b] transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-md shadow-[#C75A3B]/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
