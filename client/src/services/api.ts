import { AiTaskExtractionResponse, AiPrdGenerationResponse, AiConversationNameResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Error handling wrapper
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `API Error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<T>;
};

// Task extraction from text
export const extractTasksFromText = async (text: string): Promise<AiTaskExtractionResponse> => {
  const response = await fetch(`${API_BASE_URL}/ai/extract-tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  
  return handleResponse<AiTaskExtractionResponse>(response);
};

// Task extraction from image
export const extractTasksFromImage = async (imageData: string): Promise<AiTaskExtractionResponse> => {
  const response = await fetch(`${API_BASE_URL}/ai/extract-tasks-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: imageData }),
  });
  
  return handleResponse<AiTaskExtractionResponse>(response);
};

// PRD generation
export const generatePRD = async (
  projectTitle: string, 
  description: string
): Promise<AiPrdGenerationResponse> => {
  const response = await fetch(`${API_BASE_URL}/ai/generate-prd`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      projectTitle,
      description,
    }),
  });
  
  return handleResponse<AiPrdGenerationResponse>(response);
};

// Conversation naming
export const nameConversation = async (
  conversationText: string
): Promise<AiConversationNameResponse> => {
  const response = await fetch(`${API_BASE_URL}/ai/name-conversation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: conversationText }),
  });
  
  return handleResponse<AiConversationNameResponse>(response);
}; 