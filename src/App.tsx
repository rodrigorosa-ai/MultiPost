import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/layout/Navigation';
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { GenerateView } from './views/GenerateView';
import { ReviewView } from './views/ReviewView';
import { SettingsView } from './views/SettingsView';

function AppContent() {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
      <Navigation />
      
      <main>
        {currentView === 'landing' && <LandingView />}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'generate' && <GenerateView />}
        {currentView === 'review' && <ReviewView />}
        {currentView === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

