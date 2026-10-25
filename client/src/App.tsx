import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { MealScannerPage } from './pages/MealScannerPage';
import { FoodDiaryPage } from './pages/FoodDiaryPage';
import { MealPlannerPage } from './pages/MealPlannerPage';
import { MealHistoryPage } from './pages/MealHistoryPage';
import { ProgressTrackingPage } from './pages/ProgressTrackingPage';
import { GoalsPreferencesPage } from './pages/GoalsPreferencesPage';
import { ReceiptScannerPage } from './pages/ReceiptScannerPage';
import { AICoachPage } from './pages/AICoachPage';
import { WhatIfComparePage } from './pages/WhatIfComparePage';
import { PantryPage } from './pages/PantryPage';
import { ShoppingListPage } from './pages/ShoppingListPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { PricingPage } from './pages/PricingPage';
import { RewardsPage } from './pages/RewardsPage';
import { FamilyPage } from './pages/FamilyPage';
import { ReportsPage } from './pages/ReportsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { HelpFAQPage } from './pages/HelpFAQPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { NotFoundPage } from './pages/NotFoundPage';

const PUBLIC_PAGES = [
  'landing',
  'login',
  'register',
  'forgot-password',
  'pricing',
  'subscriptions',
  'about',
  'contact',
  'help',
  'privacy',
  'terms',
  'scan-meal'
];

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('landing');

  // Sync initial page based on auth state
  useEffect(() => {
    if (user && (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register' || currentPage === 'forgot-password')) {
      setCurrentPage('dashboard');
    } else if (!user && !PUBLIC_PAGES.includes(currentPage)) {
      setCurrentPage('landing');
    }
  }, [user]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'scan-meal':
        return <MealScannerPage onNavigate={setCurrentPage} />;
      case 'diary':
        return <FoodDiaryPage onNavigate={setCurrentPage} />;
      case 'meal-planner':
        return <MealPlannerPage onNavigate={setCurrentPage} />;
      case 'meal-history':
        return <MealHistoryPage onNavigate={setCurrentPage} />;
      case 'progress':
        return <ProgressTrackingPage onNavigate={setCurrentPage} />;
      case 'goals':
        return <GoalsPreferencesPage onNavigate={setCurrentPage} />;
      case 'scan-receipt':
        return <ReceiptScannerPage onNavigate={setCurrentPage} />;
      case 'coach':
        return <AICoachPage onNavigate={setCurrentPage} />;
      case 'what-if':
        return <WhatIfComparePage onNavigate={setCurrentPage} />;
      case 'pantry':
        return <PantryPage onNavigate={setCurrentPage} />;
      case 'shopping-list':
        return <ShoppingListPage onNavigate={setCurrentPage} />;
      case 'pricing':
        return <PricingPage onNavigate={setCurrentPage} />;
      case 'subscriptions':
        return <SubscriptionsPage onNavigate={setCurrentPage} />;
      case 'rewards':
        return <RewardsPage onNavigate={setCurrentPage} />;
      case 'family':
        return <FamilyPage onNavigate={setCurrentPage} />;
      case 'reports':
        return <ReportsPage onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfileSettingsPage onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutPage onNavigate={setCurrentPage} />;
      case 'contact':
        return <ContactPage onNavigate={setCurrentPage} />;
      case 'help':
        return <HelpFAQPage onNavigate={setCurrentPage} />;
      case 'privacy':
        return <PrivacyPolicyPage onNavigate={setCurrentPage} />;
      case 'terms':
        return <TermsOfServicePage onNavigate={setCurrentPage} />;
      default:
        return <NotFoundPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF7EF] dark:bg-[#1F342C] text-[#2E2E2E] dark:text-white transition-colors">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
