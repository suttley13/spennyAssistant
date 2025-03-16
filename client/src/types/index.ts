export interface BaseItem {
  id: string;
  description: string;
  type: 'Task' | 'Project' | 'Feature';
  deadline: string | null;
  order: number;
  links: Array<{url: string, title: string}>;
  createdAt: string;
  updatedAt: string;
}

export interface Project extends BaseItem {
  type: 'Project';
  prdLink?: string;
  figmaLink?: string;
  jiraLink?: string;
  launchPostLink?: string;
}

export type Task = BaseItem & { type: 'Task' };
export type Feature = BaseItem & { type: 'Feature' };

export type Item = Task | Project | Feature;

export interface ShippedItem {
  id: string;
  description: string;
  type: 'Task' | 'Project' | 'Feature';
  deadline: string | null;
  order: number;
  links: Array<{url: string, title: string}>;
  createdAt: string;
  updatedAt: string;
  dateShipped: string;
  prdLink?: string;
  figmaLink?: string;
  jiraLink?: string;
  launchPostLink?: string;
}

export interface PrdContent {
  taskId: string;
  content: string;
}

// AI Service Types
export interface AiTaskExtractionResponse {
  tasks: Array<{
    description: string;
    deadline?: string;
  }>;
}

export interface AiPrdGenerationResponse {
  content: string;
}

export interface AiConversationNameResponse {
  name: string;
} 