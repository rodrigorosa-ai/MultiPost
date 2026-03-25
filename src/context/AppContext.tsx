import React, { createContext, useContext, useState, useEffect } from 'react';
import { Draft, UserSettings, ViewState } from '../types';
import { MOCK_DRAFTS, DEFAULT_SETTINGS } from '../lib/api';

interface AppContextType {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  drafts: Draft[];
  setDrafts: React.Dispatch<React.SetStateAction<Draft[]>>;
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  activeDraftId: string | null;
  setActiveDraftId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [drafts, setDrafts] = useState<Draft[]>(MOCK_DRAFTS);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('instapost_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('instapost_settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <AppContext.Provider value={{
      currentView, setCurrentView,
      drafts, setDrafts,
      settings, setSettings,
      activeDraftId, setActiveDraftId
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
