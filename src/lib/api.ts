import { Draft, UserSettings } from '../types';

// Mock Data for initial state
export const MOCK_DRAFTS: Draft[] = [
  {
    id: 'd1',
    prompt: 'Post sobre estética descentralizada',
    caption: '"Explorando o futuro da estética descentralizada em interfaces sociais modernas. #Design #Futuro"',
    imageUrl: 'https://picsum.photos/seed/tech/800/1000',
    status: 'pending_approval',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'd2',
    prompt: 'Precisão da automação',
    caption: '"A automação não é apenas sobre velocidade, é sobre precisão e conexão humana."',
    imageUrl: 'https://picsum.photos/seed/automation/800/1000',
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'd3',
    prompt: 'Sistemas legados atrasando o crescimento',
    caption: '"Por que seus sistemas legados estão atrasando seu crescimento social em 2024. Uma análise profunda."',
    imageUrl: 'https://picsum.photos/seed/legacy/800/1000',
    status: 'rejected',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    feedback: 'Muito negativo. Foque mais na oportunidade do que no problema.',
  }
];

export const DEFAULT_SETTINGS: UserSettings = {
  webhookUrl: 'https://seu-n8n.com/webhook/instagram-generator-v4',
  driveFolderId: '',
  openRouterKey: '',
  uploadPostKey: '',
};

// Simulated API calls to n8n webhook
export const api = {
  async generateDraft(payload: any): Promise<Draft> {
    const response = await fetch('/api/drafts/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to generate draft');
    return response.json();
  },

  async approveDraft(draftId: string, caption: string): Promise<boolean> {
    const response = await fetch('/api/drafts/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draftId, caption })
    });
    if (!response.ok) throw new Error('Failed to approve draft');
    return true;
  },

  async rejectDraft(draftId: string, feedback: string, caption: string): Promise<any> {
    const response = await fetch('/api/drafts/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draftId, feedback, caption })
    });
    if (!response.ok) throw new Error('Failed to reject draft');
    return response.json();
  }
};
