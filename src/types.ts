export type PostStatus = 'pending_approval' | 'approved' | 'rejected' | 'published' | 'failed';

export interface Draft {
  id: string;
  prompt: string;
  caption: string;
  imageUrl: string;
  status: PostStatus;
  createdAt: string;
  scheduledFor?: string;
  tone?: string;
  hashtags?: boolean;
  feedback?: string;
  _debug?: {
    webhookUrl: string;
    webhookStatus: string;
    webhookError: string | null;
    webhookResponseText?: string;
  };
}

export interface UserSettings {
  webhookUrl: string;
  driveFolderId: string;
  openRouterKey: string;
  uploadPostKey: string;
}

export type ViewState = 'landing' | 'dashboard' | 'generate' | 'review' | 'settings';
