import React, { useState } from 'react';
import styled from 'styled-components';
import { Item } from '../../types';
import { useTaskContext } from '../../context/TaskContext';
import { useSortable } from '../../hooks/useSortable';
import ItemCard from '../common/ItemCard';
import SectionHeader from '../common/SectionHeader';
import Modal from '../common/Modal';
import ItemForm from '../common/ItemForm';

const TaskListContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow: hidden;
`;

const TaskListContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  color: #666;
  font-size: 14px;
  text-align: center;
  
  svg {
    margin-bottom: 16px;
    color: #ccc;
  }
`;

const TaskList: React.FC = () => {
  const { tasks, addItem, updateItem, deleteItem, reorderItems, shipItem } = useTaskContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // Sort tasks by order (ascending) - new tasks will have lower numbers
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
  
  // Ref for sortable container
  const taskListRef = useSortable({
    itemsKey: 'tasks',
    items: sortedTasks,
    onOrderChange: (items) => {
      reorderItems(items, 'Task');
    }
  });
  
  const handleAddTask = () => {
    setEditingItem(null);
    setIsAddModalOpen(true);
  };
  
  const handleEditTask = (task: Item) => {
    setEditingItem(task);
    setIsAddModalOpen(true);
  };
  
  const handleSubmitTask = (taskData: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
    if (editingItem) {
      updateItem({ ...editingItem, ...taskData });
    } else {
      addItem(taskData);
    }
    setIsAddModalOpen(false);
    setEditingItem(null);
  };
  
  const handleDeleteTask = (id: string) => {
    setConfirmDelete(id);
  };
  
  const confirmDeleteTask = () => {
    if (confirmDelete) {
      deleteItem(confirmDelete, 'Task');
      setConfirmDelete(null);
    }
  };
  
  const handleDeadlineChange = (id: string, deadline: string | null) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateItem({ ...task, deadline });
    }
  };
  
  return (
    <>
      <TaskListContainer>
        <SectionHeader 
          title="Tasks" 
          type="Task" 
          onAddItem={handleAddTask} 
        />
        
        <TaskListContent ref={taskListRef as React.RefObject<HTMLDivElement>}>
          {sortedTasks.length === 0 ? (
            <EmptyState>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path d="M8 14l2 2 4-4"></path>
              </svg>
              <p>No tasks yet. Add your first task by clicking the + button above.</p>
            </EmptyState>
          ) : (
            sortedTasks.map(task => (
              <ItemCard 
                key={task.id}
                item={task}
                onEdit={() => handleEditTask(task)}
                onDelete={() => handleDeleteTask(task.id)}
                onShip={() => shipItem(task.id, 'Task')}
                onDeadlineChange={(deadline) => handleDeadlineChange(task.id, deadline)}
              />
            ))
          )}
        </TaskListContent>
      </TaskListContainer>
      
      {/* Add/Edit Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Task' : 'Add Task'}
      >
        <ItemForm
          item={editingItem || undefined}
          itemType="Task"
          onSubmit={handleSubmitTask}
          onCancel={() => {
            setIsAddModalOpen(false);
            setEditingItem(null);
          }}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Confirm Delete"
        footer={
          <>
            <button 
              onClick={() => setConfirmDelete(null)}
              style={{ 
                padding: '8px 16px', 
                background: 'none', 
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginRight: '10px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              onClick={confirmDeleteTask}
              style={{ 
                padding: '8px 16px', 
                background: '#f44336', 
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete this task? This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default TaskList; 