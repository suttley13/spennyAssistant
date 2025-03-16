import { useRef, useEffect } from 'react';
import Sortable, { SortableEvent, Options } from 'sortablejs';
import { Item } from '../types';

interface UseSortableProps {
  itemsKey: string;
  items: Item[];
  onOrderChange: (items: Item[]) => void;
  options?: Partial<Options>;
}

/**
 * Custom hook to implement SortableJS drag-and-drop functionality
 * @param itemsKey - Unique identifier for the sortable list
 * @param items - Array of items to be sorted
 * @param onOrderChange - Callback function when order changes
 * @param options - Additional SortableJS options
 * @returns ref to be attached to the container element
 */
export function useSortable({
  itemsKey,
  items,
  onOrderChange,
  options = {}
}: UseSortableProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const sortableRef = useRef<Sortable | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Cleanup any existing sortable instance
    if (sortableRef.current) {
      sortableRef.current.destroy();
    }
    
    // Configure sortable options
    const sortableOptions: Options = {
      animation: 150,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      handle: '.drag-handle',
      ...options,
      onEnd: (evt: SortableEvent) => {
        const { oldIndex, newIndex } = evt;
        
        if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
          return;
        }
        
        // Create new array with updated order
        const newItems = [...items];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);
        
        // Update order property on all items
        const reorderedItems = newItems.map((item, index) => ({
          ...item,
          order: index
        }));
        
        // Call the callback with the updated items
        onOrderChange(reorderedItems);
        
        // Call the original onEnd if provided
        if (options.onEnd) {
          options.onEnd.call(sortableRef.current, evt);
        }
      }
    };
    
    // Create new sortable instance
    sortableRef.current = Sortable.create(containerRef.current, sortableOptions);
    
    // Cleanup on unmount
    return () => {
      if (sortableRef.current) {
        sortableRef.current.destroy();
        sortableRef.current = null;
      }
    };
  }, [itemsKey, items, onOrderChange, options]);
  
  return containerRef;
} 