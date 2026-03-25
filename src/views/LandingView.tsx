import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from '../components/Logo';

export function LandingView() {
  const { setCurrentView } = useApp();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#070612] flex flex-col">
      {/* Top Bar for Landing */}
      <header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center w-full px-6 py-6">
        <Logo className="h-14 w-auto text-primary" />
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="text-sm font-label uppercase tracking-widest text-on-surface hover:text-primary transition-colors"
        >
          Login
        </button>
      </header>

      {/* Background Visuals */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 w-full h-full translate-x-[10%] md:translate-x-[200px] scale-[1.2]">
          <div className="w-full h-full opacity-40 bg-gradient-to-tr from-[#070612] via-[#070612]/20 to-transparent">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK7s8PUrjCmAr2_HXp1HXa14Juz4ULxpzjUiLPu_xfpDbbsKmwxCSdkkw9rHWO9MCLjIPScjxOHAIPi9ju8YkE0YuicOk8ONMfoYZ5BH4BFqFs06-dI9Yirx109AJlLkR6A9wcJ5X7IyV6M6w_HH5ZqNkCUkBrBFe58xyvwQV5O0c-wj1NlhmfAjmEU0J44o3pa0N9o8iKzfeWwNs0px6aB1icw92Bxycf6FkoK4GEr4UenLwxf6qpeL2LGvupos2PfKoJ7H5IgyGJ" 
              alt="Abstract fluid motion" 
              className="w-full h-full object-cover mix-blend-screen"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#070612] via-[#070612]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#070612] via-transparent to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto flex-1 px-6 pt-24 pb-12 flex flex-col justify-center max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl space-y-8 md:space-y-10"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
            <Sparkles size={14} className="text-secondary" />
            <span className="text-on-surface text-[10px] font-bold tracking-[0.2em] uppercase font-label">NOVO ALIADO DE AUTOMAÇÃO IA</span>
          </div>

          {/* Headline */}
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-headline leading-[1.1] tracking-tight text-on-surface">
              Desbloqueie o Poder da <br className="hidden md:block" /> IA para o seu <br className="hidden md:block" /> 
              <span className="italic text-primary-dim">Negócio.</span>
            </h1>
            <p className="text-on-surface-variant text-base md:text-xl max-w-xl font-body leading-relaxed">
              Nossa plataforma de IA de ponta automatiza, analisa e acelera seus fluxos de trabalho para que você possa focar no que realmente importa.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 pt-4">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="group relative w-full sm:w-auto px-10 py-5 rounded-full bg-on-surface text-surface font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-[0px_0px_30px_rgba(175,162,255,0.4)] active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">COMEÇAR AGORA</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dim opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button className="w-full sm:w-auto px-10 py-5 rounded-full border border-outline-variant/30 bg-surface-variant/20 backdrop-blur-md text-on-surface font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:bg-surface-variant/40 active:scale-95 flex items-center justify-center gap-2 group">
              SAIBA MAIS 
              <ArrowRight size={18} className="text-primary group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
