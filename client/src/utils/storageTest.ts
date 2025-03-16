import * as storageService from '../services/storage';

/**
 * Simple utility to test localStorage functionality
 * This can be run in the browser console to verify storage is working
 */

export const testLocalStorage = (): boolean => {
  const TEST_KEY = 'spenny-assistant-test-storage';
  const TEST_VALUE = { test: 'value', timestamp: new Date().toISOString() };
  
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.error('localStorage is not available in this browser');
      return false;
    }
    
    // Try to write to localStorage
    localStorage.setItem(TEST_KEY, JSON.stringify(TEST_VALUE));
    
    // Try to read from localStorage
    const storedValue = localStorage.getItem(TEST_KEY);
    if (!storedValue) {
      console.error('Failed to retrieve test value from localStorage');
      return false;
    }
    
    // Parse and verify the value
    const parsedValue = JSON.parse(storedValue);
    const success = parsedValue.test === TEST_VALUE.test;
    
    // Clean up
    localStorage.removeItem(TEST_KEY);
    
    if (success) {
      console.log('localStorage test passed successfully!');
      return true;
    } else {
      console.error('localStorage test failed: values do not match');
      return false;
    }
  } catch (error) {
    console.error('localStorage test failed with error:', error);
    return false;
  }
};

/**
 * Test if the application's specific storage is working
 * This verifies the app can save and retrieve data from all storage keys
 */
export const testAppStorage = (): {success: boolean, data: any} => {
  try {
    // Get current data (to restore later)
    const currentTasks = storageService.getTasks();
    const currentProjects = storageService.getProjects();
    const currentFeatures = storageService.getFeatures();
    const currentShipped = storageService.getShippedItems();
    const currentPrdContents = storageService.getPrdContents();
    
    // Current state summary
    const summary = {
      taskCount: currentTasks.length,
      projectCount: currentProjects.length,
      featureCount: currentFeatures.length,
      shippedCount: currentShipped.length,
      prdCount: currentPrdContents.length
    };
    
    console.log('Current storage state:', summary);
    
    // Test a specific storage function (getTasks and saveTasks)
    // We'll create a test task, save it, retrieve it, then restore original state
    const testTask = {
      id: 'test-task-id',
      description: 'Test task for storage verification',
      type: 'Task' as const,
      deadline: null,
      order: 9999,
      links: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save test task along with existing tasks
    storageService.saveTasks([...currentTasks, testTask]);
    
    // Retrieve all tasks
    const retrievedTasks = storageService.getTasks();
    
    // Check if our test task is in the retrieved tasks
    const foundTask = retrievedTasks.find((task: any) => task.id === 'test-task-id');
    
    // Restore original tasks
    storageService.saveTasks(currentTasks);
    
    // Verify test results
    if (foundTask && foundTask.description === testTask.description) {
      console.log('App storage test passed successfully!');
      return { 
        success: true, 
        data: summary
      };
    } else {
      console.error('App storage test failed: Test task was not retrieved correctly');
      return { 
        success: false, 
        data: summary
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('App storage test failed with error:', errorMessage);
    return { 
      success: false, 
      data: { error: errorMessage }
    };
  }
}; 