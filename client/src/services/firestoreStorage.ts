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
    // For shipped items we don't need to order by 'order'
    const baseQuery = query(
      collection(db, collectionName),
      where('userId', '==', DEFAULT_USER_ID)
    );
    
    // Add orderBy for collections that have order field
    const q = collectionName !== COLLECTIONS.SHIPPED 
      ? query(baseQuery, orderBy('order'))
      : baseQuery;
    
    const querySnapshot = await getDocs(q);
    const items: T[] = [];
    
    querySnapshot.forEach((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
      const data = docSnapshot.data();
      // Skip deleted items
      if (data.deleted === true) {
        return;
      }
      items.push(data as T);
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
    
    // First, get all existing tasks from Firestore
    const existingTasks = await getTasks();
    
    // Create a set of current task IDs for quick lookup
    const currentTaskIds = new Set(tasks.map(task => task.id));
    
    // Create promises for all operations
    const promises = [];
    
    // Delete tasks that are no longer in the tasks array
    for (const existingTask of existingTasks) {
      if (!currentTaskIds.has(existingTask.id) && db) {
        console.log(`Deleting task with ID ${existingTask.id} from Firestore`);
        const docRef = doc(db, COLLECTIONS.TASKS, existingTask.id);
        promises.push(setDoc(docRef, { deleted: true, userId: DEFAULT_USER_ID }));
      }
    }
    
    // Save all current tasks
    for (const task of tasks) {
      const taskWithUser = { 
        ...task, 
        userId: DEFAULT_USER_ID 
      };
      
      if (db) {
        const docRef = doc(db, COLLECTIONS.TASKS, task.id);
        promises.push(setDoc(docRef, taskWithUser));
      }
    }
    
    await Promise.all(promises);
    console.log(`Saved ${tasks.length} tasks to Firestore and removed deleted tasks`);
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
    
    // First, get all existing projects from Firestore
    const existingProjects = await getProjects();
    
    // Create a set of current project IDs for quick lookup
    const currentProjectIds = new Set(projects.map(project => project.id));
    
    // Create promises for all operations
    const promises = [];
    
    // Delete projects that are no longer in the projects array
    for (const existingProject of existingProjects) {
      if (!currentProjectIds.has(existingProject.id) && db) {
        console.log(`Deleting project with ID ${existingProject.id} from Firestore`);
        const docRef = doc(db, COLLECTIONS.PROJECTS, existingProject.id);
        promises.push(setDoc(docRef, { deleted: true, userId: DEFAULT_USER_ID }));
      }
    }
    
    // Save all current projects
    for (const project of projects) {
      const projectWithUser = { 
        ...project, 
        userId: DEFAULT_USER_ID 
      };
      
      if (db) {
        const docRef = doc(db, COLLECTIONS.PROJECTS, project.id);
        promises.push(setDoc(docRef, projectWithUser));
      }
    }
    
    await Promise.all(promises);
    console.log(`Saved ${projects.length} projects to Firestore and removed deleted projects`);
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
    
    // First, get all existing features from Firestore
    const existingFeatures = await getFeatures();
    
    // Create a set of current feature IDs for quick lookup
    const currentFeatureIds = new Set(features.map(feature => feature.id));
    
    // Create promises for all operations
    const promises = [];
    
    // Delete features that are no longer in the features array
    for (const existingFeature of existingFeatures) {
      if (!currentFeatureIds.has(existingFeature.id) && db) {
        console.log(`Deleting feature with ID ${existingFeature.id} from Firestore`);
        const docRef = doc(db, COLLECTIONS.FEATURES, existingFeature.id);
        promises.push(setDoc(docRef, { deleted: true, userId: DEFAULT_USER_ID }));
      }
    }
    
    // Save all current features
    for (const feature of features) {
      const featureWithUser = { 
        ...feature, 
        userId: DEFAULT_USER_ID 
      };
      
      if (db) {
        const docRef = doc(db, COLLECTIONS.FEATURES, feature.id);
        promises.push(setDoc(docRef, featureWithUser));
      }
    }
    
    await Promise.all(promises);
    console.log(`Saved ${features.length} features to Firestore and removed deleted features`);
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
    
    // Add special handling for shipped items
    const q = query(
      collection(db, COLLECTIONS.SHIPPED),
      where('userId', '==', DEFAULT_USER_ID)
    );
    
    const querySnapshot = await getDocs(q);
    const items: ShippedItem[] = [];
    
    querySnapshot.forEach((docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
      items.push(docSnapshot.data() as ShippedItem);
    });
    
    console.log(`Loaded ${items.length} shipped items from Firestore`);
    return items;
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
    
    // Enhanced logging for debugging
    console.log(`Saving ${shippedItems.length} shipped items to Firestore`);
    
    // Save each shipped item individually to ensure they persist correctly
    const promises = shippedItems.map(item => {
      // Make sure dateShipped is included and valid
      const shippedItem = {
        ...item,
        userId: DEFAULT_USER_ID,
        dateShipped: item.dateShipped || new Date().toISOString()
      };
      
      if (db) {
        const docRef = doc(db, COLLECTIONS.SHIPPED, item.id);
        return setDoc(docRef, shippedItem);
      }
      return Promise.resolve();
    });
    
    await Promise.all(promises);
    console.log(`Successfully saved ${shippedItems.length} shipped items to Firestore`);
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