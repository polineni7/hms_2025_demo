import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ReceptionDashboard } from './components/ReceptionDashboard';
import { FinancialDashboard } from './components/FinancialDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AppProvider, useApp } from './context/AppContext';

function AppContent() {
  const { currentUser, logout } = useApp();

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'reception':
        return <ReceptionDashboard />;
      case 'financial':
        return <FinancialDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      default:
        return <LoginPage />;
    }
  };

  return <>{renderDashboard()}</>;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
