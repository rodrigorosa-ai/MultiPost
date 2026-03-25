import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export function GenerateView() {
  const { setDrafts, setCurrentView, setActiveDraftId } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    prompt: '',
    tone: 'Profissional',
    hashtags: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.prompt.trim()) return;

    setIsGenerating(true);
    try {
      const newDraft = await api.generateDraft(formData);
      setDrafts(prev => [newDraft, ...prev]);
      setActiveDraftId(newDraft.id);
      setCurrentView('review');
    } catch (error) {
      console.error('Failed to generate draft', error);
      alert('Falha ao gerar rascunho. Verifique suas configurações.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen pt-24 pb-32 px-6 flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-4xl bg-surface-container-low rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/15 flex flex-col md:flex-row">
        
        {/* Left Side: Info Panel */}
        <div className="md:w-1/3 bg-surface-container-highest p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary rounded-full blur-[60px]"></div>
          </div>
          
          <div className="relative z-10">
            <span className="text-secondary font-label text-xs uppercase tracking-[0.2em] mb-4 block">Motor de Rascunhos v2.0</span>
            <h2 className="font-headline italic text-4xl text-on-surface leading-tight mb-6">Gerar Novo Post</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
              Deixe nossa orquestra de inteligência artificial compor sua próxima presença digital.
            </p>
          </div>
          
          <div className="relative z-10 p-5 rounded-xl glass-panel">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles size={16} className="text-secondary" />
              <span className="font-bold text-xs text-on-surface tracking-wide">Google Gemini AI</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-normal">
              Utilizamos a integração nativa com Google Gemini para gerar sugestões de prompts criativos e legendas otimizadas para engajamento.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-2/3 p-8 md:p-12 bg-surface">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Prompt Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-label text-xs font-bold text-primary tracking-widest uppercase">Descrição do Post</label>
                <span className="text-[10px] text-outline italic">Sugerido pelo Gemini</span>
              </div>
              <div className="relative group">
                <textarea 
                  required
                  value={formData.prompt}
                  onChange={e => setFormData({...formData, prompt: e.target.value})}
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-secondary transition-all duration-300 outline-none resize-none" 
                  placeholder="Ex: Post sobre automação de marketing para pequenas empresas focando em economia de tempo..." 
                  rows={5}
                />
                <div className="absolute inset-0 rounded-xl border border-outline-variant/15 pointer-events-none group-focus-within:border-secondary/30"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Tone Select */}
              <div className="space-y-2">
                <label className="font-label text-xs font-bold text-primary tracking-widest uppercase">Tom de Voz</label>
                <div className="relative group">
                  <select 
                    value={formData.tone}
                    onChange={e => setFormData({...formData, tone: e.target.value})}
                    className="w-full bg-surface-container-lowest border-none rounded-full px-6 py-3 text-sm text-on-surface appearance-none focus:ring-1 focus:ring-secondary cursor-pointer outline-none"
                  >
                    <option>Profissional</option>
                    <option>Casual</option>
                    <option>Humorístico</option>
                    <option>Inspirador</option>
                  </select>
                  <div className="absolute inset-0 rounded-full border border-outline-variant/15 pointer-events-none group-focus-within:border-secondary/30"></div>
                </div>
              </div>

              {/* Hashtags Checkbox */}
              <div className="space-y-2">
                <label className="font-label text-xs font-bold text-primary tracking-widest uppercase">Otimização</label>
                <label className="flex items-center gap-3 bg-surface-container-lowest rounded-full px-6 py-3 cursor-pointer group hover:bg-surface-container-high transition-colors border border-outline-variant/15">
                  <input 
                    type="checkbox" 
                    checked={formData.hashtags}
                    onChange={e => setFormData({...formData, hashtags: e.target.checked})}
                    className="w-5 h-5 rounded bg-surface border-outline-variant text-primary focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer" 
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Incluir Hashtags</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-outline-variant/10">
              <button 
                type="submit" 
                disabled={isGenerating || !formData.prompt.trim()}
                className="flex-1 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed font-bold py-4 rounded-full shadow-lg shadow-primary-dim/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Sparkles size={20} />
                )}
                {isGenerating ? 'Gerando...' : 'Gerar Post'}
              </button>
              <button 
                type="button"
                onClick={() => setCurrentView('dashboard')}
                className="px-10 py-4 rounded-full bg-surface-container-high text-primary font-bold hover:bg-surface-container-highest transition-all active:scale-95"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
