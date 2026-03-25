import React from 'react';
import { useApp } from '../context/AppContext';
import { Draft } from '../types';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

export function DashboardView() {
  const { drafts, setCurrentView, setActiveDraftId } = useApp();

  const stats = {
    total: drafts.length,
    pending: drafts.filter(d => d.status === 'pending_approval').length,
    published: drafts.filter(d => d.status === 'published' || d.status === 'approved').length,
  };

  const handleReview = (id: string) => {
    setActiveDraftId(id);
    setCurrentView('review');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-12 relative"
    >
      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total de Rascunhos" 
          value={stats.total.toString()} 
          subtitle="+12% esta semana" 
          color="text-primary" 
        />
        <StatCard 
          title="Pronto para revisar" 
          value={stats.pending.toString()} 
          subtitle="Aguardando ação" 
          color="text-secondary" 
        />
        <StatCard 
          title="Aprovados/Publicados" 
          value={stats.published.toString()} 
          subtitle="Feed ao Vivo" 
          color="text-tertiary" 
          pulse
        />
      </section>

      {/* Drafts Section Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-headline italic font-bold text-on-surface">Rascunhos Recentes</h2>
          <p className="text-on-surface-variant mt-2 font-label">Seu fluxo de conteúdo automatizado</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-surface-container-highest px-4 py-2 rounded-full text-sm font-label text-on-surface-variant hover:text-primary transition-colors">Filtrar</button>
          <button className="bg-surface-container-highest px-4 py-2 rounded-full text-sm font-label text-on-surface-variant hover:text-primary transition-colors">Ordenar</button>
        </div>
      </div>

      {/* Drafts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {drafts.map((draft) => (
          <DraftCard key={draft.id} draft={draft} onReview={() => handleReview(draft.id)} />
        ))}
        {drafts.length === 0 && (
          <div className="col-span-full py-12 text-center text-on-surface-variant">
            Nenhum rascunho encontrado. Gere um novo post para começar.
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setCurrentView('generate')}
        className="fixed bottom-24 right-8 w-16 h-16 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed rounded-full shadow-[0px_20px_40px_rgba(175,162,255,0.4)] flex items-center justify-center z-[60] active:scale-90 transition-transform duration-200 hover:scale-105 md:hidden"
      >
        <Plus size={32} />
      </button>
    </motion.div>
  );
}

function StatCard({ title, value, subtitle, color, pulse }: { title: string, value: string, subtitle: string, color: string, pulse?: boolean }) {
  return (
    <div className="bg-surface-container-low p-8 rounded-2xl flex flex-col justify-between group hover:bg-surface-container-high transition-colors duration-300 shadow-xl border border-outline-variant/5">
      <span className="text-on-surface-variant font-label text-sm uppercase tracking-widest mb-4">{title}</span>
      <div className="flex items-baseline gap-3">
        <span className={`text-5xl font-headline italic font-bold ${color}`}>{value}</span>
        <span className={`text-sm font-label ${color} ${pulse ? 'animate-pulse' : ''}`}>
          {pulse && '● '} {subtitle}
        </span>
      </div>
    </div>
  );
}

const DraftCard: React.FC<{ draft: Draft, onReview: () => void }> = ({ draft, onReview }) => {
  const statusConfig = {
    pending_approval: { label: 'PENDENTE', bg: 'bg-primary-container', text: 'text-on-primary-container' },
    approved: { label: 'APROVADO', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
    rejected: { label: 'REJEITADO', bg: 'bg-error-container', text: 'text-on-error-container' },
    published: { label: 'PUBLICADO', bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
    failed: { label: 'FALHA', bg: 'bg-error', text: 'text-on-error' },
  };

  const config = statusConfig[draft.status] || statusConfig.pending_approval;

  return (
    <div className="bg-surface-container-low rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-outline-variant/5 flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-lowest">
        {draft.imageUrl ? (
          <img 
            src={draft.imageUrl} 
            alt="Miniatura do Rascunho" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline-variant">Sem Imagem</div>
        )}
        <div className="absolute top-4 right-4">
          <span className={`${config.bg} ${config.text} text-[10px] font-bold uppercase tracking-tighter px-3 py-1 rounded-full`}>
            {config.label}
          </span>
        </div>
      </div>
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <p className="text-on-surface/80 line-clamp-3 text-sm leading-relaxed italic font-headline flex-1">
          {draft.caption}
        </p>
        <div className="flex flex-wrap gap-2 py-2 mt-auto">
          <button 
            onClick={onReview}
            className="flex-1 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed rounded-full py-2.5 text-xs font-bold uppercase tracking-widest active:scale-95 transition-all"
          >
            {draft.status === 'pending_approval' ? 'REVISAR' : 'VER DETALHES'}
          </button>
        </div>
      </div>
    </div>
  );
}
