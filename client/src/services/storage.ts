import { Item, PrdContent, ShippedItem } from '../types';

// Storage keys
const TASKS_KEY = 'spenny-assistant-tasks';
const PROJECTS_KEY = 'spenny-assistant-projects';
const FEATURES_KEY = 'spenny-assistant-features';
const SHIPPED_KEY = 'spenny-assistant-shipped';
const PRD_CONTENTS_KEY = 'spenny-assistant-prd-contents';

// Helper to parse stored JSON with error handling
const parseStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error parsing data from localStorage for key: ${key}`, error);
    return defaultValue;
  }
};

// Tasks
export const getTasks = (): Item[] => 
  parseStoredData<Item[]>(TASKS_KEY, []).filter(item => item.type === 'Task');

export const saveTasks = (tasks: Item[]): void => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

// Projects
export const getProjects = (): Item[] => 
  parseStoredData<Item[]>(PROJECTS_KEY, []).filter(item => item.type === 'Project');

export const saveProjects = (projects: Item[]): void => {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

// Features
export const getFeatures = (): Item[] => 
  parseStoredData<Item[]>(FEATURES_KEY, []).filter(item => item.type === 'Feature');

export const saveFeatures = (features: Item[]): void => {
  localStorage.setItem(FEATURES_KEY, JSON.stringify(features));
};

// Shipped items
export const getShippedItems = (): ShippedItem[] => 
  parseStoredData<ShippedItem[]>(SHIPPED_KEY, []);

export const saveShippedItems = (shippedItems: ShippedItem[]): void => {
  localStorage.setItem(SHIPPED_KEY, JSON.stringify(shippedItems));
};

// PRD contents
export const getPrdContents = (): PrdContent[] => 
  parseStoredData<PrdContent[]>(PRD_CONTENTS_KEY, []);

export const savePrdContents = (prdContents: PrdContent[]): void => {
  localStorage.setItem(PRD_CONTENTS_KEY, JSON.stringify(prdContents));
};

export const getPrdContentForTask = (taskId: string): string | null => {
  const prdContents = getPrdContents();
  const prdContent = prdContents.find(content => content.taskId === taskId);
  return prdContent ? prdContent.content : null;
};

export const savePrdContentForTask = (taskId: string, content: string): void => {
  const prdContents = getPrdContents();
  const existingIndex = prdContents.findIndex(item => item.taskId === taskId);
  
  if (existingIndex >= 0) {
    prdContents[existingIndex].content = content;
  } else {
    prdContents.push({ taskId, content });
  }
  
  savePrdContents(prdContents);
}; 