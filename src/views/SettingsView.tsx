import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export function SettingsView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-24 px-6 pb-32 max-w-4xl mx-auto space-y-12"
    >
      {/* Page Title */}
      <section className="space-y-2">
        <h2 className="font-headline italic font-bold text-4xl text-on-surface tracking-tight">Configurações</h2>
        <p className="text-on-surface-variant font-body text-sm">Gerenciamento de segurança e integrações.</p>
      </section>

      <div className="space-y-10">
        <section className="bg-surface-container-low p-8 md:p-12 rounded-3xl border border-outline-variant/10 text-center space-y-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck size={40} className="text-primary" />
          </div>
          <h3 className="font-headline italic text-2xl text-on-surface">Configurações Seguras</h3>
          <p className="text-on-surface-variant max-w-lg leading-relaxed">
            Por motivos de segurança, as chaves de API (OpenRouter, UploadPost) e os endereços de Webhook (n8n) foram movidos para o backend. 
          </p>
          <p className="text-on-surface-variant max-w-lg leading-relaxed">
            Eles agora são configurados de forma segura através de <strong>Variáveis de Ambiente (.env)</strong> no servidor, protegendo suas credenciais contra exposição no navegador.
          </p>
        </section>
      </div>
    </motion.div>
  );
}
