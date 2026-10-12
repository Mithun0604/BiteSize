import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MealScannerPage } from './pages/MealScannerPage';
import { ReceiptScannerPage } from './pages/ReceiptScannerPage';
import { AICoachPage } from './pages/AICoachPage';
import { WhatIfComparePage } from './pages/WhatIfComparePage';
import { PantryPage } from './pages/PantryPage';
import { ShoppingListPage } from './pages/ShoppingListPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { RewardsPage } from './pages/RewardsPage';
import { FamilyPage } from './pages/FamilyPage';
import { ReportsPage } from './pages/ReportsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { HelpFAQPage } from './pages/HelpFAQPage';
import { authApi } from './services/api';

const AppContent: React.FC = () => {
  const { user, login } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('landing');

  // Sync initial page based on auth state
  useEffect(() => {
    if (user && (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register')) {
      setCurrentPage('dashboard');
    } else if (!user && currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'register' && currentPage !== 'subscriptions' && currentPage !== 'help') {
      setCurrentPage('landing');
    }
  }, [user]);

  const handleQuickDemo = async () => {
    try {
      const res = await authApi.login({ email: 'demo@bitesize.app', password: 'bitesize123' });
      if (res.success) {
        login(res.token, res.user, res.profile);
        setCurrentPage('dashboard');
      }
    } catch (err: any) {
      alert("Demo sign-in error: " + err.message);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} onQuickDemo={handleQuickDemo} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'scan-meal':
        return <MealScannerPage onNavigate={setCurrentPage} />;
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
      case 'help':
        return <HelpFAQPage onNavigate={setCurrentPage} />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] dark:bg-[#1E2A3A] text-[#2E2E2E] dark:text-white transition-colors">
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
