import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Item, ShippedItem } from '../types';
import * as localStorageService from '../services/storage';
import * as firestoreService from '../services/firestoreStorage';
import { isFirebaseConfigured } from '../services/firebase';

// We'll need to install uuid for generating unique IDs
// When building the application, run: npm install uuid @types/uuid

// Action types
type ActionType = 
  | { type: 'ADD_ITEM'; item: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'order'> }
  | { type: 'UPDATE_ITEM'; item: Item }
  | { type: 'DELETE_ITEM'; id: string; itemType: 'Task' | 'Project' | 'Feature' }
  | { type: 'REORDER_ITEMS'; items: Item[]; itemType: 'Task' | 'Project' | 'Feature' }
  | { type: 'SHIP_ITEM'; id: string; itemType: 'Task' | 'Project' | 'Feature' }
  | { type: 'UNSHIP_ITEM'; id: string }
  | { type: 'SET_ITEMS'; tasks: Item[]; projects: Item[]; features: Item[]; shipped: ShippedItem[] }
  | { type: 'SET_LOADING'; isLoading: boolean };

// State interface
interface TaskState {
  tasks: Item[];
  projects: Item[];
  features: Item[];
  shipped: ShippedItem[];
  isLoading: boolean;
}

// Initial state
const initialState: TaskState = {
  tasks: [],
  projects: [],
  features: [],
  shipped: [],
  isLoading: true,
};

// Reducer function
const taskReducer = (state: TaskState, action: ActionType): TaskState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const now = new Date().toISOString();
      const newItem: Item = {
        ...action.item,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
        order: getNextOrder(state, action.item.type)
      };
      
      // Add to appropriate collection at the beginning
      if (newItem.type === 'Task') {
        return { ...state, tasks: [newItem, ...state.tasks] };
      } else if (newItem.type === 'Project') {
        return { ...state, projects: [newItem, ...state.projects] };
      } else {
        return { ...state, features: [newItem, ...state.features] };
      }
    }
    
    case 'UPDATE_ITEM': {
      const updatedItem = { 
        ...action.item, 
        updatedAt: new Date().toISOString() 
      };
      
      // Update in appropriate collection
      if (updatedItem.type === 'Task') {
        return { 
          ...state, 
          tasks: state.tasks.map(item => 
            item.id === updatedItem.id ? updatedItem : item
          )
        };
      } else if (updatedItem.type === 'Project') {
        return { 
          ...state, 
          projects: state.projects.map(item => 
            item.id === updatedItem.id ? updatedItem : item
          )
        };
      } else {
        return { 
          ...state, 
          features: state.features.map(item => 
            item.id === updatedItem.id ? updatedItem : item
          )
        };
      }
    }
    
    case 'DELETE_ITEM': {
      // Delete from appropriate collection
      if (action.itemType === 'Task') {
        return { 
          ...state, 
          tasks: state.tasks.filter(item => item.id !== action.id)
        };
      } else if (action.itemType === 'Project') {
        return { 
          ...state, 
          projects: state.projects.filter(item => item.id !== action.id)
        };
      } else {
        return { 
          ...state, 
          features: state.features.filter(item => item.id !== action.id)
        };
      }
    }
    
    case 'REORDER_ITEMS': {
      // Update order in appropriate collection
      if (action.itemType === 'Task') {
        return { ...state, tasks: action.items };
      } else if (action.itemType === 'Project') {
        return { ...state, projects: action.items };
      } else {
        return { ...state, features: action.items };
      }
    }
    
    case 'SHIP_ITEM': {
      let itemToShip: Item | undefined;
      let updatedCollection: Item[];
      
      // Find item and remove from appropriate collection
      if (action.itemType === 'Task') {
        itemToShip = state.tasks.find(item => item.id === action.id);
        updatedCollection = state.tasks.filter(item => item.id !== action.id);
        
        if (!itemToShip) return state;
        return { 
          ...state, 
          tasks: updatedCollection,
          shipped: [
            ...state.shipped, 
            { ...itemToShip, dateShipped: new Date().toISOString() }
          ]
        };
      } else if (action.itemType === 'Project') {
        itemToShip = state.projects.find(item => item.id === action.id);
        updatedCollection = state.projects.filter(item => item.id !== action.id);
        
        if (!itemToShip) return state;
        return { 
          ...state, 
          projects: updatedCollection,
          shipped: [
            ...state.shipped, 
            { ...itemToShip, dateShipped: new Date().toISOString() }
          ]
        };
      } else {
        itemToShip = state.features.find(item => item.id === action.id);
        updatedCollection = state.features.filter(item => item.id !== action.id);
        
        if (!itemToShip) return state;
        return { 
          ...state, 
          features: updatedCollection,
          shipped: [
            ...state.shipped, 
            { ...itemToShip, dateShipped: new Date().toISOString() }
          ]
        };
      }
    }
    
    case 'UNSHIP_ITEM': {
      const shippedItem = state.shipped.find(item => item.id === action.id);
      
      if (!shippedItem) return state;
      
      // Remove from shipped and add back to appropriate collection
      const { dateShipped, ...unshippedItem } = shippedItem;
      
      if (unshippedItem.type === 'Task') {
        return { 
          ...state, 
          tasks: [...state.tasks, unshippedItem],
          shipped: state.shipped.filter(item => item.id !== action.id)
        };
      } else if (unshippedItem.type === 'Project') {
        return { 
          ...state, 
          projects: [...state.projects, unshippedItem],
          shipped: state.shipped.filter(item => item.id !== action.id)
        };
      } else {
        return { 
          ...state, 
          features: [...state.features, unshippedItem],
          shipped: state.shipped.filter(item => item.id !== action.id)
        };
      }
    }
    
    case 'SET_ITEMS':
      return {
        ...state,
        tasks: action.tasks,
        projects: action.projects,
        features: action.features,
        shipped: action.shipped,
        isLoading: false
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading
      };
      
    default:
      return state;
  }
};

// Helper to get next order number
const getNextOrder = (state: TaskState, itemType: 'Task' | 'Project' | 'Feature'): number => {
  const items = itemType === 'Task' 
    ? state.tasks 
    : itemType === 'Project' 
      ? state.projects 
      : state.features;
  
  return items.length > 0
    ? Math.max(...items.map(item => item.order)) + 1
    : 0;
};

// Create context
interface TaskContextType extends TaskState {
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  updateItem: (item: Item) => void;
  deleteItem: (id: string, itemType: 'Task' | 'Project' | 'Feature') => void;
  reorderItems: (items: Item[], itemType: 'Task' | 'Project' | 'Feature') => void;
  shipItem: (id: string, itemType: 'Task' | 'Project' | 'Feature') => void;
  unshipItem: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  
  // No need to determine storage mode, always use Firebase if configured
  
  // Load data on initial mount
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', isLoading: true });
      
      try {
        let tasks: Item[] = [], 
            projects: Item[] = [], 
            features: Item[] = [], 
            shipped: ShippedItem[] = [];
        
        if (isFirebaseConfigured()) {
          // Load from Firestore
          const [tasksData, projectsData, featuresData, shippedData] = await Promise.all([
            firestoreService.getTasks(),
            firestoreService.getProjects(),
            firestoreService.getFeatures(),
            firestoreService.getShippedItems()
          ]);
          
          // Type casting to ensure correct types
          tasks = tasksData as Item[];
          projects = projectsData as Item[];
          features = featuresData as Item[];
          shipped = shippedData as ShippedItem[];
        } else {
          // Fallback to localStorage only if Firebase isn't configured
          tasks = localStorageService.getTasks();
          projects = localStorageService.getProjects();
          features = localStorageService.getFeatures();
          shipped = localStorageService.getShippedItems();
        }
        
        dispatch({ 
          type: 'SET_ITEMS', 
          tasks, 
          projects, 
          features,
          shipped
        });
      } catch (error) {
        console.error('Error loading data:', error);
        
        // Fallback to localStorage if Firebase fails
        const tasks = localStorageService.getTasks();
        const projects = localStorageService.getProjects();
        const features = localStorageService.getFeatures();
        const shipped = localStorageService.getShippedItems();
        
        dispatch({ 
          type: 'SET_ITEMS', 
          tasks, 
          projects, 
          features,
          shipped
        });
      } finally {
        dispatch({ type: 'SET_LOADING', isLoading: false });
      }
    };
    
    loadData();
  }, []); // Removed state.storageMode dependency
  
  // Save data whenever state changes
  useEffect(() => {
    // Skip saving during initial load
    if (state.isLoading) return;
    
    const saveData = async () => {
      try {
        if (isFirebaseConfigured()) {
          // Save to Firestore
          await Promise.all([
            firestoreService.saveTasks(state.tasks),
            firestoreService.saveProjects(state.projects),
            firestoreService.saveFeatures(state.features),
            firestoreService.saveShippedItems(state.shipped)
          ]);
        } else {
          // Fallback to localStorage only if Firebase isn't configured
          localStorageService.saveTasks(state.tasks);
          localStorageService.saveProjects(state.projects);
          localStorageService.saveFeatures(state.features);
          localStorageService.saveShippedItems(state.shipped);
        }
      } catch (error) {
        console.error('Error saving data:', error);
        
        // Always save to localStorage as backup
        localStorageService.saveTasks(state.tasks);
        localStorageService.saveProjects(state.projects);
        localStorageService.saveFeatures(state.features);
        localStorageService.saveShippedItems(state.shipped);
      }
    };
    
    saveData();
  }, [state.tasks, state.projects, state.features, state.shipped]);
  
  // Context value
  const value: TaskContextType = {
    ...state,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
    updateItem: (item) => dispatch({ type: 'UPDATE_ITEM', item }),
    deleteItem: (id, itemType) => dispatch({ type: 'DELETE_ITEM', id, itemType }),
    reorderItems: (items, itemType) => dispatch({ type: 'REORDER_ITEMS', items, itemType }),
    shipItem: (id, itemType) => dispatch({ type: 'SHIP_ITEM', id, itemType }),
    unshipItem: (id) => dispatch({ type: 'UNSHIP_ITEM', id }),
  };
  
  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the context
export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  
  return context;
}; 