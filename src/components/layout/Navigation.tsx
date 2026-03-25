import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, Sparkles, CheckSquare, Settings } from 'lucide-react';

export function Navigation() {
  const { currentView, setCurrentView } = useApp();

  if (currentView === 'landing') return null;

  const navItems: Array<{ id: string, icon: any, label: string, isPrimary?: boolean }> = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Rascunhos' },
    { id: 'generate', icon: Sparkles, label: 'Gerar', isPrimary: true },
    { id: 'review', icon: CheckSquare, label: 'Revisar' },
    { id: 'settings', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center w-full px-6 py-4 bg-surface-container-low/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <h1 
            className="font-headline italic font-bold text-2xl text-primary tracking-tight cursor-pointer"
            onClick={() => setCurrentView('landing')}
          >
            MultiPost
          </h1>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`font-label uppercase tracking-widest text-[10px] transition-colors duration-300 ${
                currentView === item.id ? 'text-primary font-bold' : 'text-on-surface/60 hover:text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDieWCgn2Vf1wvm6nPT-KvHBmEGfRGyfD6kGVKehCDHHyG0gqUpk6-6xtGiexpzkqOZh2L4I6tq6SfkArK480TITUTxJkbsQwokrnWgOi7_MRvjMTq55HxviLgf3gEzKnvDJuc5IVVA_KyaDa_EO661lzq11Nmnf8nQz9sXq4UgFXUxlukdpWoeMEdTxCzJZqSyIEiygDJRRBXlQXl4_shjyulPKNm4hh7UiIoN2LsgsSay4f68iK1UH6NgBd9aHz8Ot1NIJbOSDA5" 
              alt="User Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Bottom Glass Nav (Mobile & Primary Actions) */}
      <nav className="fixed bottom-6 left-0 right-0 z-50 flex justify-around items-center px-4 md:hidden">
        <div className="w-[90%] max-w-md mx-auto glass-panel rounded-full py-2 px-3 flex justify-around items-center shadow-2xl">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            if (item.isPrimary) {
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className="flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed rounded-full px-5 py-2 scale-110 active:scale-95 transition-transform shadow-lg shadow-primary/20"
                >
                  <Icon size={20} className="mb-1" />
                  <span className="font-label font-bold text-[10px] tracking-wider uppercase">{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`flex flex-col items-center justify-center px-4 py-2 transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-on-surface/50 hover:text-primary'
                }`}
              >
                <Icon size={20} className="mb-1" />
                <span className="font-label font-medium text-[10px] tracking-wider uppercase">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
