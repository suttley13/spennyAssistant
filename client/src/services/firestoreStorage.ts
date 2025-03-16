// Firestore data service - handles CRUD operations with Firestore
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
  CollectionReference
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import * as localStorage from './storage';
import { Item, ShippedItem } from '../types';

// Collection names
const COLLECTIONS = {
  TASKS: 'tasks',
  PROJECTS: 'projects',
  FEATURES: 'features',
  SHIPPED: 'shipped',
  PRD_CONTENTS: 'prdContents'
};

// User ID - would normally come from auth service
// For now, we'll use a default ID for all data since we don't have multi-user support yet
const DEFAULT_USER_ID = 'default-user';

// Generic data saving function
const saveDataToFirestore = async <T extends { id: string }>(
  collectionName: string, 
  items: T[]
): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    // Fall back to localStorage
    return;
  }

  try {
    const promises = items.map(item => {
      // Add userId field to each item
      const itemWithUser = { 
        ...item, 
        userId: DEFAULT_USER_ID 
      };
      
      // Use the item's ID as the document ID
      if (db) {
        const docRef = doc(db, collectionName, item.id);
        return setDoc(docRef, itemWithUser);
      }
      return Promise.resolve();
    });
    
    await Promise.all(promises);
    console.log(`Saved ${items.length} items to Firestore collection: ${collectionName}`);
  } catch (error) {
    console.error(`Error saving to Firestore collection ${collectionName}:`, error);
    // Fall back to localStorage in case of error
    throw error;
  }
};

// Generic data loading function
const loadDataFromFirestore = async <T>(
  collectionName: string
): Promise<T[]> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase is not configured');
  }
  
  try {
    // Query for documents belonging to the current user
    const q = query(
      collection(db, collectionName),
      where('userId', '==', DEFAULT_USER_ID),
      orderBy('order')
    );
    
    const querySnapshot = await getDocs(q);
    const items: T[] = [];
    
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      items.push(doc.data() as T);
    });
    
    console.log(`Loaded ${items.length} items from Firestore collection: ${collectionName}`);
    return items;
  } catch (error) {
    console.error(`Error loading from Firestore collection ${collectionName}:`, error);
    throw error;
  }
};

// Tasks CRUD operations
export const getTasks = async (): Promise<Item[]> => {
  try {
    if (!isFirebaseConfigured() || !db) {
      return localStorage.getTasks();
    }
    return await loadDataFromFirestore<Item>(COLLECTIONS.TASKS);
  } catch (error) {
    console.error('Error in getTasks, falling back to localStorage:', error);
    return localStorage.getTasks();
  }
};

export const saveTasks = async (tasks: Item[]): Promise<void> => {
  try {
    // Always save to localStorage as a backup
    localStorage.saveTasks(tasks);
    
    if (!isFirebaseConfigured() || !db) {
      return;
    }
    
    await saveDataToFirestore(COLLECTIONS.TASKS, tasks);
  } catch (error) {
    console.error('Error in saveTasks:', error);
    // localStorage save already done above
  }
};

// Projects CRUD operations
export const getProjects = async (): Promise<Item[]> => {
  try {
    if (!isFirebaseConfigured() || !db) {
      return localStorage.getProjects();
    }
    return await loadDataFromFirestore<Item>(COLLECTIONS.PROJECTS);
  } catch (error) {
    console.error('Error in getProjects, falling back to localStorage:', error);
    return localStorage.getProjects();
  }
};

export const saveProjects = async (projects: Item[]): Promise<void> => {
  try {
    // Always save to localStorage as a backup
    localStorage.saveProjects(projects);
    
    if (!isFirebaseConfigured() || !db) {
      return;
    }
    
    await saveDataToFirestore(COLLECTIONS.PROJECTS, projects);
  } catch (error) {
    console.error('Error in saveProjects:', error);
    // localStorage save already done above
  }
};

// Features CRUD operations
export const getFeatures = async (): Promise<Item[]> => {
  try {
    if (!isFirebaseConfigured() || !db) {
      return localStorage.getFeatures();
    }
    return await loadDataFromFirestore<Item>(COLLECTIONS.FEATURES);
  } catch (error) {
    console.error('Error in getFeatures, falling back to localStorage:', error);
    return localStorage.getFeatures();
  }
};

export const saveFeatures = async (features: Item[]): Promise<void> => {
  try {
    // Always save to localStorage as a backup
    localStorage.saveFeatures(features);
    
    if (!isFirebaseConfigured() || !db) {
      return;
    }
    
    await saveDataToFirestore(COLLECTIONS.FEATURES, features);
  } catch (error) {
    console.error('Error in saveFeatures:', error);
    // localStorage save already done above
  }
};

// Shipped items CRUD operations
export const getShippedItems = async (): Promise<ShippedItem[]> => {
  try {
    if (!isFirebaseConfigured() || !db) {
      return localStorage.getShippedItems();
    }
    return await loadDataFromFirestore<ShippedItem>(COLLECTIONS.SHIPPED);
  } catch (error) {
    console.error('Error in getShippedItems, falling back to localStorage:', error);
    return localStorage.getShippedItems();
  }
};

export const saveShippedItems = async (shippedItems: ShippedItem[]): Promise<void> => {
  try {
    // Always save to localStorage as a backup
    localStorage.saveShippedItems(shippedItems);
    
    if (!isFirebaseConfigured() || !db) {
      return;
    }
    
    await saveDataToFirestore(COLLECTIONS.SHIPPED, shippedItems);
  } catch (error) {
    console.error('Error in saveShippedItems:', error);
    // localStorage save already done above
  }
};

// PRD contents CRUD operations
export const getPrdContents = async (): Promise<any[]> => {
  try {
    if (!isFirebaseConfigured() || !db) {
      return localStorage.getPrdContents();
    }
    return await loadDataFromFirestore<any>(COLLECTIONS.PRD_CONTENTS);
  } catch (error) {
    console.error('Error in getPrdContents, falling back to localStorage:', error);
    return localStorage.getPrdContents();
  }
};

export const savePrdContents = async (prdContents: any[]): Promise<void> => {
  try {
    // Always save to localStorage as a backup
    localStorage.savePrdContents(prdContents);
    
    if (!isFirebaseConfigured() || !db) {
      return;
    }
    
    await saveDataToFirestore(COLLECTIONS.PRD_CONTENTS, prdContents);
  } catch (error) {
    console.error('Error in savePrdContents:', error);
    // localStorage save already done above
  }
}; 