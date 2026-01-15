
export type Role = 'user' | 'assistant';

export interface AIResponse {
  summary: string;
  insight: string;
  evidenceGrade: 'A' | 'B' | 'C' | 'D';
  sources: string[];
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  insight?: string;
  evidenceGrade?: string;
  sources?: string[];
  timestamp: Date;
}

export interface SuggestedQuery {
  title: string;
  prompt: string;
}
