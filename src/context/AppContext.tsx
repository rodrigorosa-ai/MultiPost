import React, { createContext, useContext, useState } from 'react';
import { Draft, ViewState } from '../types';
import { MOCK_DRAFTS } from '../lib/api';

interface AppContextType {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  drafts: Draft[];
  setDrafts: React.Dispatch<React.SetStateAction<Draft[]>>;
  activeDraftId: string | null;
  setActiveDraftId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [drafts, setDrafts] = useState<Draft[]>(MOCK_DRAFTS);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{
      currentView, setCurrentView,
      drafts, setDrafts,
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
