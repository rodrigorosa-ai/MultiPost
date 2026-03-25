import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link, HardDrive, KeyRound, Save } from 'lucide-react';
import { motion } from 'motion/react';

export function SettingsView() {
  const { settings, setSettings } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setSettings(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-24 px-6 pb-32 max-w-4xl mx-auto space-y-12"
    >
      {/* Page Title */}
      <section className="space-y-2">
        <h2 className="font-headline italic font-bold text-4xl text-on-surface tracking-tight">Configurações</h2>
        <p className="text-on-surface-variant font-body text-sm">Gerencie suas chaves de API e conexões de automação.</p>
      </section>

      <div className="space-y-10">
        {/* Webhook Connection Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <h3 className="font-body font-bold text-xl text-on-surface">Webhooks e Automação</h3>
          </div>
          
          <div className="bg-surface-container-low p-8 rounded-2xl space-y-6 border border-outline-variant/5">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-primary/70 ml-1">n8n Webhook URL</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={localSettings.webhookUrl}
                  onChange={e => setLocalSettings({...localSettings, webhookUrl: e.target.value})}
                  className="w-full bg-surface-container-lowest border-none rounded-xl px-5 py-4 text-on-surface placeholder:text-outline/50 focus:ring-1 focus:ring-secondary transition-all outline-none" 
                  placeholder="https://seu-n8n.com/webhook/instagram-generator-v4" 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Link size={18} className="text-secondary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Storage & Identity */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
            <h3 className="font-body font-bold text-xl text-on-surface">Armazenamento de Ativos</h3>
          </div>
          
          <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/5">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-secondary/70 ml-1">ID da Pasta do Google Drive</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={localSettings.driveFolderId}
                  onChange={e => setLocalSettings({...localSettings, driveFolderId: e.target.value})}
                  className="w-full bg-surface-container-lowest border-none rounded-xl px-5 py-4 text-on-surface placeholder:text-outline/50 focus:ring-1 focus:ring-secondary transition-all outline-none" 
                  placeholder="1zXy...789abc" 
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <HardDrive size={18} className="text-secondary" />
                </div>
              </div>
              <p className="text-[11px] text-outline-variant mt-2 px-1">Insira o ID da pasta onde as imagens geradas serão armazenadas temporariamente.</p>
            </div>
          </div>
        </section>

        {/* API Access Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-tertiary rounded-full"></div>
            <h3 className="font-body font-bold text-xl text-on-surface">Chaves de API</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-low p-6 rounded-2xl space-y-4 border border-outline-variant/5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface">OpenRouter</span>
                <KeyRound size={20} className="text-tertiary" />
              </div>
              <input 
                type="password" 
                value={localSettings.openRouterKey}
                onChange={e => setLocalSettings({...localSettings, openRouterKey: e.target.value})}
                className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-1 focus:ring-tertiary transition-all outline-none" 
                placeholder="sk-or-v1-..." 
              />
            </div>
            
            <div className="bg-surface-container-low p-6 rounded-2xl space-y-4 border border-outline-variant/5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface">UploadPost</span>
                <KeyRound size={20} className="text-tertiary" />
              </div>
              <input 
                type="password" 
                value={localSettings.uploadPostKey}
                onChange={e => setLocalSettings({...localSettings, uploadPostKey: e.target.value})}
                className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-1 focus:ring-tertiary transition-all outline-none" 
                placeholder="up_api_..." 
              />
            </div>
          </div>
        </section>

        {/* Action Area */}
        <section className="pt-8 pb-12 flex flex-col items-center gap-6">
          <button 
            onClick={handleSave}
            className="w-full md:w-80 py-5 bg-gradient-to-br from-primary to-primary-dim text-on-primary-fixed font-bold text-lg rounded-full shadow-[0px_10px_30px_rgba(116,89,247,0.3)] hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isSaved ? <Save size={20} /> : null}
            {isSaved ? 'Salvo!' : 'Salvar Configurações'}
          </button>
        </section>
      </div>
    </motion.div>
  );
}
