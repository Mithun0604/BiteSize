import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Camera,
  Receipt,
  Sparkles,
  ArrowRightLeft,
  Refrigerator,
  ShoppingCart,
  Coins,
  Users,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'scan-meal', label: 'Scan Meal', icon: Camera, highlight: true },
    { id: 'scan-receipt', label: 'Receipts', icon: Receipt },
    { id: 'coach', label: 'AI Coach', icon: Sparkles },
    { id: 'what-if', label: 'What If?', icon: ArrowRightLeft },
    { id: 'pantry', label: 'Pantry & Plate', icon: Refrigerator },
    { id: 'shopping-list', label: 'Shopping', icon: ShoppingCart },
    { id: 'rewards', label: 'Rewards', icon: Coins },
    { id: 'family', label: 'Family', icon: Users, sharedOnly: true }
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const getPlanBadge = (plan?: string) => {
    switch (plan) {
      case 'shared_bite':
        return { label: 'Shared Bite', bg: 'bg-[#5B6B7A] text-white' };
      case 'big_bite':
        return { label: 'Big Bite', bg: 'bg-[#C75A3B] text-white' };
      default:
        return { label: 'Small Bite', bg: 'bg-[#E8E6E1] text-[#2E2E2E]' };
    }
  };

  const planBadge = getPlanBadge(user?.plan);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F4]/90 dark:bg-[#1E2A3A]/95 backdrop-blur-md border-b border-[#E8E6E1] dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick(user ? 'dashboard' : 'landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C75A3B] to-[#E8987F] flex items-center justify-center shadow-md shadow-[#C75A3B]/20 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 4.5 3 8.5 7.5 9.7.5.1 1-.2 1-.7v-3c0-.6.4-1 1-1h1c.6 0 1 .4 1 1v3c0 .5.5.8 1 .7 4.5-1.2 7.5-5.2 7.5-9.7 0-5.5-4.5-10-10-10z" />
                <path d="M12 7v5l3 3" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#2E2E2E] dark:text-white">BiteSize</span>
                <span className="w-2 h-2 rounded-full bg-[#C75A3B]"></span>
              </div>
              <p className="text-[10px] text-[#5B6B7A] dark:text-slate-400 font-medium tracking-wide hidden sm:block">
                Your groceries, understood.
              </p>
            </div>
          </div>

          {/* Desktop Navigation for Logged-In Users */}
          {user ? (
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map(item => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#C75A3B] text-white shadow-sm'
                        : item.highlight
                        ? 'text-[#C75A3B] dark:text-[#E8987F] hover:bg-[#F6D6C9]/40 dark:hover:bg-slate-800'
                        : 'text-[#5B6B7A] dark:text-slate-300 hover:text-[#2E2E2E] dark:hover:text-white hover:bg-[#F8F7F4] dark:hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          ) : (
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => handleNavClick('landing')}
                className={`text-sm font-medium ${currentPage === 'landing' ? 'text-[#C75A3B]' : 'text-[#5B6B7A] hover:text-[#2E2E2E]'}`}
              >
                Overview
              </button>
              <button
                onClick={() => handleNavClick('subscriptions')}
                className="text-sm font-medium text-[#5B6B7A] hover:text-[#2E2E2E]"
              >
                Plans & Pricing
              </button>
              <button
                onClick={() => handleNavClick('help')}
                className="text-sm font-medium text-[#5B6B7A] hover:text-[#2E2E2E]"
              >
                How It Works
              </button>
            </nav>
          )}

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[#5B6B7A] dark:text-slate-300 hover:bg-[#F8F7F4] dark:hover:bg-slate-800 transition-colors"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl border border-[#E8E6E1] dark:border-slate-700 hover:border-[#C75A3B] transition-colors bg-white dark:bg-slate-800"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F4] dark:bg-slate-700 flex items-center justify-center font-semibold text-xs text-[#C75A3B]">
                    {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left pr-1">
                    <p className="text-xs font-semibold text-[#2E2E2E] dark:text-white leading-tight">
                      {profile?.display_name || user.fullName}
                    </p>
                    <span className={`inline-block text-[10px] font-medium px-1.5 py-0.2 rounded ${planBadge.bg}`}>
                      {planBadge.label}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-[#E8E6E1] dark:border-slate-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#E8E6E1] dark:border-slate-700">
                      <p className="text-xs text-[#5B6B7A] dark:text-slate-400">Signed in as</p>
                      <p className="text-xs font-medium text-[#2E2E2E] dark:text-white truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#2E2E2E] dark:text-slate-200 hover:bg-[#FAF8F4] dark:hover:bg-slate-700"
                    >
                      <User className="w-4 h-4 text-[#5B6B7A]" />
                      <span>Profile & Health Targets</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('subscriptions')}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#2E2E2E] dark:text-slate-200 hover:bg-[#FAF8F4] dark:hover:bg-slate-700"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#C75A3B]" />
                      <span>Manage Subscription</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('reports')}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#2E2E2E] dark:text-slate-200 hover:bg-[#FAF8F4] dark:hover:bg-slate-700"
                    >
                      <BarChart3 className="w-4 h-4 text-[#5B6B7A]" />
                      <span>Nutrition Reports</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('help')}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#2E2E2E] dark:text-slate-200 hover:bg-[#FAF8F4] dark:hover:bg-slate-700"
                    >
                      <HelpCircle className="w-4 h-4 text-[#5B6B7A]" />
                      <span>Help & FAQ</span>
                    </button>

                    <div className="border-t border-[#E8E6E1] dark:border-slate-700 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        handleNavClick('landing');
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#D96B6B] hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[#2E2E2E] dark:text-white hover:bg-black/5 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-[#C75A3B] text-white hover:bg-[#a8472d] shadow-sm transition-all shadow-[#C75A3B]/20"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-[#5B6B7A] dark:text-slate-300 hover:bg-[#F8F7F4] dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && user && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-[#E8E6E1] dark:border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map(item => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#C75A3B] text-white'
                    : 'text-[#2E2E2E] dark:text-slate-200 hover:bg-[#FAF8F4] dark:hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5 text-current" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
