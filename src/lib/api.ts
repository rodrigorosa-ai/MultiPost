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
  async generateDraft(settings: UserSettings, payload: any): Promise<Draft> {
    console.log('Calling webhook to generate draft:', settings.webhookUrl, payload);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate response
    return {
      id: `d${Date.now()}`,
      prompt: payload.prompt,
      caption: `Legenda gerada para: ${payload.prompt}\n\n#Automação #IA #MultiPost`,
      imageUrl: 'https://picsum.photos/seed/generated/800/1000', // Placeholder from mockups
      status: 'pending_approval',
      createdAt: new Date().toISOString(),
      tone: payload.tone,
      hashtags: payload.hashtags
    };
  },

  async approveDraft(settings: UserSettings, draftId: string, caption: string): Promise<boolean> {
    console.log('Calling webhook to approve draft:', settings.webhookUrl, { draftId, caption });
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  },

  async rejectDraft(settings: UserSettings, draftId: string, feedback: string): Promise<boolean> {
    console.log('Calling webhook to reject draft:', settings.webhookUrl, { draftId, feedback });
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
};
