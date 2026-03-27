import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/api';
import { CheckCircle2, XCircle, Edit3, Clock, Hash, History, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export function ReviewView() {
  const { drafts, activeDraftId, setCurrentView, setDrafts } = useApp();
  const draft = drafts.find(d => d.id === activeDraftId) || drafts[0];
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [editedCaption, setEditedCaption] = useState(draft?.caption || '');

  // Reset state when draft changes
  React.useEffect(() => {
    if (draft) {
      setEditedCaption(draft.caption);
      setShowRejectInput(false);
      setFeedback('');
    }
  }, [draft]);

  if (!draft) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-on-surface-variant">
        <div className="text-center space-y-4">
          <p>Nenhum rascunho selecionado para revisão.</p>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="text-primary hover:underline"
          >
            Voltar aos rascunhos
          </button>
        </div>
      </div>
    );
  }

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await api.approveDraft(draft.id, editedCaption);
      setDrafts(prev => prev.map(d => d.id === draft.id ? { ...d, status: 'approved', caption: editedCaption } : d));
      alert('Post aprovado e enviado para publicação!');
      setCurrentView('dashboard');
    } catch (error) {
      console.error(error);
      alert('Erro ao aprovar post.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    
    if (!feedback.trim()) {
      alert('Por favor, forneça o feedback para os ajustes.');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await api.rejectDraft(draft.id, feedback, editedCaption);
      
      setDrafts(prev => prev.map(d => {
        if (d.id === draft.id) {
          const historyEntry = {
            caption: editedCaption,
            imageUrl: d.imageUrl,
            feedback: feedback,
            rejectedAt: new Date().toISOString()
          };
          
          return { 
            ...d, 
            status: 'pending_approval', // Keep it pending for the new review
            caption: response.caption || d.caption,
            imageUrl: response.imageUrl || d.imageUrl,
            feedback: '', // Clear feedback for the new version
            history: [...(d.history || []), historyEntry],
            _debug: response._debug || d._debug
          };
        }
        return d;
      }));
      
      alert('Novo rascunho gerado com base no seu feedback!');
      setShowRejectInput(false);
      setFeedback('');
    } catch (error) {
      console.error(error);
      alert('Erro ao rejeitar post.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isPending = draft.status === 'pending_approval';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-6 pt-24 pb-32 space-y-12"
    >
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Visual Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative aspect-[4/5] bg-surface-container-low rounded-2xl overflow-hidden">
              {draft.imageUrl ? (
                <img 
                  src={draft.imageUrl} 
                  alt="Pré-visualização do Post" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-outline-variant">Sem Imagem</div>
              )}
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="bg-surface-container-highest/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-outline-variant/20">
                  Feed do Instagram
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              {isPending && <div className="w-3 h-3 rounded-full bg-secondary animate-pulse shadow-[0_0_12px_rgba(0,207,252,0.6)]"></div>}
              <span className={`font-label font-semibold text-sm tracking-wide ${isPending ? 'text-secondary' : 'text-on-surface-variant'}`}>
                Status: {draft.status === 'pending_approval' ? 'PENDENTE' : draft.status === 'approved' ? 'APROVADO' : draft.status === 'rejected' ? 'REJEITADO' : draft.status === 'published' ? 'PUBLICADO' : 'FALHA'}
              </span>
            </div>
            <div className="text-on-surface-variant text-sm font-medium">
              Criado em: {new Date(draft.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <label className="font-label font-bold text-xs uppercase tracking-[0.2em] text-on-surface-variant ml-1">Conteúdo da Legenda</label>
            <div className="relative">
              <textarea 
                value={editedCaption}
                onChange={e => setEditedCaption(e.target.value)}
                readOnly={!isPending}
                className={`w-full h-64 bg-surface-container-lowest border-none rounded-2xl p-6 font-body text-on-surface leading-relaxed focus:ring-1 focus:ring-secondary/50 transition-all resize-none shadow-inner ${!isPending && 'opacity-70'}`}
              />
              <div className="absolute bottom-4 right-4 text-xs text-on-surface-variant/50">
                {editedCaption.length} / 2200
              </div>
            </div>
          </div>

          {/* Actions */}
          {isPending && (
            <div className="space-y-4 pt-4">
              <button 
                onClick={handleApprove}
                disabled={isProcessing}
                className="w-full py-5 rounded-full bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary-dim/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                Aprovar
              </button>
              
              {!showRejectInput ? (
                <button 
                  onClick={() => setShowRejectInput(true)}
                  disabled={isProcessing}
                  className="w-full py-5 rounded-full bg-surface-container-high border border-error/30 text-error font-bold text-lg flex items-center justify-center gap-3 hover:bg-error/5 active:scale-95 transition-all disabled:opacity-50"
                >
                  <XCircle /> Rejeitar
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-surface-container-low rounded-2xl p-6 space-y-4 border border-outline-variant/10"
                >
                  <div className="flex items-center gap-2 text-tertiary">
                    <Edit3 size={20} />
                    <span className="font-bold text-sm uppercase tracking-wider">AJUSTES NECESSÁRIOS</span>
                  </div>
                  <textarea 
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    className="w-full h-24 bg-surface-container-lowest border-none rounded-xl p-4 text-sm font-body text-on-surface focus:ring-1 focus:ring-tertiary/40 transition-all resize-none" 
                    placeholder="Forneça feedback para os ajustes..."
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleReject}
                      disabled={isProcessing || !feedback.trim()}
                      className="flex-1 py-3 rounded-full bg-error/20 text-error font-bold text-sm hover:bg-error/30 transition-colors disabled:opacity-50"
                    >
                      Confirmar Rejeição
                    </button>
                    <button 
                      onClick={() => setShowRejectInput(false)}
                      className="px-6 py-3 rounded-full bg-surface-container-highest text-on-surface font-bold text-sm hover:bg-surface-variant transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Post Details / Meta Bento */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-2xl bg-surface-container-high border border-outline-variant/5 space-y-3">
          <Clock className="text-primary" size={32} />
          <h3 className="font-bold text-lg">Data Agendada</h3>
          <p className="text-on-surface-variant text-sm">Imediato após aprovação</p>
        </div>
        <div className="p-8 rounded-2xl bg-surface-container-high border border-outline-variant/5 space-y-3">
          <Hash className="text-secondary" size={32} />
          <h3 className="font-bold text-lg">Hashtags Automáticas</h3>
          <p className="text-on-surface-variant text-sm">{draft.hashtags !== false ? 'Ativado' : 'Desativado'}</p>
        </div>
        <div className="p-8 rounded-2xl bg-surface-container-high border border-outline-variant/5 space-y-3">
          <History className="text-tertiary" size={32} />
          <h3 className="font-bold text-lg">Histórico</h3>
          <p className="text-on-surface-variant text-sm">Gerado via Prompt: "{draft.prompt.substring(0, 20)}..."</p>
          {draft.history && draft.history.length > 0 && (
            <p className="text-tertiary text-sm font-bold mt-2">
              {draft.history.length} versão(ões) anterior(es) rejeitada(s)
            </p>
          )}
        </div>
      </section>

      {/* History Panel */}
      {draft.history && draft.history.length > 0 && (
        <section className="mt-8 space-y-6">
          <h3 className="font-bold text-xl flex items-center gap-2 text-on-surface">
            <History size={24} className="text-tertiary" />
            Histórico de Versões Rejeitadas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {draft.history.map((h, index) => (
              <div key={index} className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-tertiary">Versão {index + 1}</span>
                  <span className="text-xs text-on-surface-variant">{new Date(h.rejectedAt).toLocaleString()}</span>
                </div>
                
                <div className="space-y-2">
                  <span className="text-xs font-bold text-error uppercase">Motivo da Rejeição:</span>
                  <p className="text-sm text-on-surface bg-error/10 p-3 rounded-lg border border-error/20">{h.feedback}</p>
                </div>
                
                <div className="space-y-2">
                  <span className="text-xs font-bold text-on-surface-variant uppercase">Legenda Anterior:</span>
                  <p className="text-sm text-on-surface-variant bg-surface-container-lowest p-3 rounded-lg line-clamp-3">{h.caption}</p>
                </div>
                
                {h.imageUrl && (
                  <div className="aspect-video bg-surface-container-lowest rounded-lg overflow-hidden relative">
                    <img src={h.imageUrl} alt={`Versão ${index + 1}`} className="w-full h-full object-cover opacity-50 grayscale" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-surface-container-highest/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-on-surface">Imagem Antiga</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Debug Info Panel */}
      {draft._debug && (
        <section className="mt-8 p-6 bg-error/10 border border-error/30 rounded-2xl">
          <h3 className="text-error font-bold mb-4 flex items-center gap-2">
            <XCircle size={20} />
            Informações de Diagnóstico do Webhook (n8n)
          </h3>
          <div className="space-y-2 text-sm font-mono text-on-surface-variant break-all">
            <p><strong className="text-on-surface">URL:</strong> {draft._debug.webhookUrl}</p>
            <p><strong className="text-on-surface">Status HTTP:</strong> {draft._debug.webhookStatus}</p>
            {draft._debug.webhookError && (
              <p><strong className="text-error">Erro:</strong> {draft._debug.webhookError}</p>
            )}
            {draft._debug.webhookResponseText && (
              <p><strong className="text-on-surface">Resposta do Servidor:</strong> {draft._debug.webhookResponseText}</p>
            )}
          </div>
        </section>
      )}
    </motion.div>
  );
}
