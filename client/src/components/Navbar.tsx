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
  HelpCircle,
  Calendar,
  ChefHat,
  History,
  TrendingUp,
  Target,
  Info,
  Mail,
  Home
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

  // Main primary navigation bar items for logged-in users
  const loggedInNavItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'scan-meal', label: 'Meals', icon: Camera, highlight: true },
    { id: 'meal-planner', label: 'Plan', icon: ChefHat },
    { id: 'scan-receipt', label: 'Groceries', icon: ShoppingCart }
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const getPlanBadge = (plan?: string) => {
    switch (plan) {
      case 'shared_bite':
        return { label: 'Shared Bite', bg: 'bg-[#68766E] text-white' };
      case 'big_bite':
        return { label: 'Big Bite', bg: 'bg-[#B85B3E] text-white' };
      default:
        return { label: 'Small Bite', bg: 'bg-[#E8E0D3] text-[#2E2E2E]' };
    }
  };

  const planBadge = getPlanBadge(user?.plan);

  return (
    <header className="sticky top-0 z-50 bg-[#FBF7EF]/90 dark:bg-[#1F342C]/95 backdrop-blur-md border-b border-[#E8E0D3] dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick(user ? 'dashboard' : 'landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B85B3E] to-[#D88A70] flex items-center justify-center shadow-md shadow-[#B85B3E]/20 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 4.5 3 8.5 7.5 9.7.5.1 1-.2 1-.7v-3c0-.6.4-1 1-1h1c.6 0 1 .4 1 1v3c0 .5.5.8 1 .7 4.5-1.2 7.5-5.2 7.5-9.7 0-5.5-4.5-10-10-10z" />
                <path d="M12 7v5l3 3" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#2E2E2E] dark:text-white">BiteSize</span>
                <span className="w-2 h-2 rounded-full bg-[#B85B3E]"></span>
              </div>
              <p className="text-[10px] text-[#68766E] dark:text-slate-400 font-medium tracking-wide hidden sm:block">
                Your groceries, understood.
              </p>
            </div>
          </div>

          {/* Desktop Navigation for Logged-In Users */}
          {user ? (
            <nav className="hidden xl:flex items-center space-x-1">
              {loggedInNavItems.map(item => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#B85B3E] text-white shadow-sm'
                        : item.highlight
                        ? 'text-[#B85B3E] dark:text-[#D88A70] hover:bg-[#F2D5C5]/40 dark:hover:bg-slate-800'
                        : 'text-[#68766E] dark:text-slate-300 hover:text-[#2E2E2E] dark:hover:text-white hover:bg-[#F4F0E7] dark:hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          ) : (
            /* Simple public navigation */
            <nav className="hidden lg:flex items-center gap-8">
              <button onClick={() => handleNavClick('landing')} className="home-nav-link">Home</button>
              <button onClick={() => handleNavClick('pricing')} className="home-nav-link">Plans</button>
              <button onClick={() => handleNavClick('about')} className="home-nav-link">About</button>
            </nav>          )}

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[#68766E] dark:text-slate-300 hover:bg-[#F4F0E7] dark:hover:bg-slate-800 transition-colors"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-pressed={theme === 'dark'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl border border-[#E8E0D3] dark:border-slate-700 hover:border-[#B85B3E] transition-colors bg-white dark:bg-slate-800"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FBF7EF] dark:bg-slate-700 flex items-center justify-center font-semibold text-xs text-[#B85B3E]">
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
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-[#E8E0D3] dark:border-slate-700 py-2 z-50 animate-scale-in">
                    <div className="px-4 py-2.5 border-b border-[#E8E0D3] dark:border-slate-700">
                      <p className="text-[10px] text-[#68766E] dark:text-slate-400">Signed in as</p>
                      <p className="text-xs font-bold text-[#2E2E2E] dark:text-white truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNavClick('profile')}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-[#2E2E2E] dark:text-slate-200 hover:bg-[#FBF7EF] dark:hover:bg-slate-700"
                      >
                        <User className="w-4 h-4 text-[#68766E]" />
                        <span>Profile & Settings</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('goals')}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-[#2E2E2E] dark:text-slate-200 hover:bg-[#FBF7EF] dark:hover:bg-slate-700"
                      >
                        <Target className="w-4 h-4 text-[#B85B3E]" />
                        <span>Goals & Dietary Preferences</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('meal-history')}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-[#2E2E2E] dark:text-slate-200 hover:bg-[#FBF7EF] dark:hover:bg-slate-700"
                      >
                        <History className="w-4 h-4 text-[#68766E]" />
                        <span>Meal History Archive</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('progress')}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-[#2E2E2E] dark:text-slate-200 hover:bg-[#FBF7EF] dark:hover:bg-slate-700"
                      >
                        <TrendingUp className="w-4 h-4 text-[#2E7D6B]" />
                        <span>Progress & BMI Tracking</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('pricing')}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-[#2E2E2E] dark:text-slate-200 hover:bg-[#FBF7EF] dark:hover:bg-slate-700"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#D4A85A]" />
                        <span>Subscription Plans</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('reports')}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-[#2E2E2E] dark:text-slate-200 hover:bg-[#FBF7EF] dark:hover:bg-slate-700"
                      >
                        <BarChart3 className="w-4 h-4 text-[#68766E]" />
                        <span>Analytics & Export Reports</span>
                      </button>
                    </div>

                    <div className="border-t border-[#E8E0D3] dark:border-slate-700 my-1"></div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNavClick('about')}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-[#68766E] dark:text-slate-300 hover:bg-[#FBF7EF] dark:hover:bg-slate-700"
                      >
                        <Info className="w-4 h-4" />
                        <span>About BiteSize</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('contact')}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-[#68766E] dark:text-slate-300 hover:bg-[#FBF7EF] dark:hover:bg-slate-700"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Support & Contact</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('help')}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-[#68766E] dark:text-slate-300 hover:bg-[#FBF7EF] dark:hover:bg-slate-700"
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>Help & FAQ</span>
                      </button>
                    </div>

                    <div className="border-t border-[#E8E0D3] dark:border-slate-700 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        handleNavClick('landing');
                      }}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-semibold text-[#D96B6B] hover:bg-red-50 dark:hover:bg-red-950/20"
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
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#68766E] hover:text-[#2E2E2E] dark:hover:text-white"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#B85B3E] text-white hover:bg-[#b0482b] shadow-md shadow-[#B85B3E]/20 transition-transform hover:scale-105"
                >
                  Sign Up Free
                </button>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#68766E] hover:bg-[#F4F0E7] dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E0D3] dark:border-slate-800 bg-[#FBF7EF] dark:bg-[#1F342C] px-4 pt-3 pb-6 space-y-1">
          {user ? (
            <>
              {loggedInNavItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    currentPage === item.id
                      ? 'bg-[#B85B3E] text-white'
                      : 'text-[#2E2E2E] dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </>
          ) : (
            <>
              <button onClick={() => handleNavClick('landing')} className="home-mobile-link">Home</button>
              <button onClick={() => handleNavClick('pricing')} className="home-mobile-link">Plans</button>
              <button onClick={() => handleNavClick('about')} className="home-mobile-link">About</button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
