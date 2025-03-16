import React, { useState } from 'react';
import styled from 'styled-components';
import { Item } from '../../types';
import { useTaskContext } from '../../context/TaskContext';
import { useSortable } from '../../hooks/useSortable';
import ItemCard from '../common/ItemCard';
import SectionHeader from '../common/SectionHeader';
import Modal from '../common/Modal';
import ItemForm from '../common/ItemForm';

const FeatureListContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow: hidden;
  margin-top: 20px;
`;

const FeatureListContent = styled.div`
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

const FeatureList: React.FC = () => {
  const { features, addItem, updateItem, deleteItem, reorderItems, shipItem } = useTaskContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // Sort features by order
  const sortedFeatures = [...features].sort((a, b) => a.order - b.order);
  
  // Ref for sortable container
  const featureListRef = useSortable({
    itemsKey: 'features',
    items: sortedFeatures,
    onOrderChange: (items) => {
      reorderItems(items, 'Feature');
    }
  });
  
  const handleAddFeature = () => {
    setEditingItem(null);
    setIsAddModalOpen(true);
  };
  
  const handleEditFeature = (feature: Item) => {
    setEditingItem(feature);
    setIsAddModalOpen(true);
  };
  
  const handleSubmitFeature = (featureData: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
    if (editingItem) {
      updateItem({ ...editingItem, ...featureData });
    } else {
      addItem(featureData);
    }
    setIsAddModalOpen(false);
    setEditingItem(null);
  };
  
  const handleDeleteFeature = (id: string) => {
    setConfirmDelete(id);
  };
  
  const confirmDeleteFeature = () => {
    if (confirmDelete) {
      deleteItem(confirmDelete, 'Feature');
      setConfirmDelete(null);
    }
  };
  
  const handleDeadlineChange = (id: string, deadline: string | null) => {
    const feature = features.find(f => f.id === id);
    if (feature) {
      updateItem({ ...feature, deadline });
    }
  };
  
  return (
    <>
      <FeatureListContainer>
        <SectionHeader 
          title="Features" 
          type="Feature" 
          onAddItem={handleAddFeature} 
        />
        
        <FeatureListContent ref={featureListRef as React.RefObject<HTMLDivElement>}>
          {sortedFeatures.length === 0 ? (
            <EmptyState>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <p>No features yet. Add your first feature by clicking the + button above.</p>
            </EmptyState>
          ) : (
            sortedFeatures.map(feature => (
              <ItemCard 
                key={feature.id}
                item={feature}
                onEdit={() => handleEditFeature(feature)}
                onDelete={() => handleDeleteFeature(feature.id)}
                onShip={() => shipItem(feature.id, 'Feature')}
                onDeadlineChange={(deadline) => handleDeadlineChange(feature.id, deadline)}
              />
            ))
          )}
        </FeatureListContent>
      </FeatureListContainer>
      
      {/* Add/Edit Feature Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Feature' : 'Add Feature'}
      >
        <ItemForm
          item={editingItem || undefined}
          itemType="Feature"
          onSubmit={handleSubmitFeature}
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
              onClick={confirmDeleteFeature}
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
        <p>Are you sure you want to delete this feature? This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default FeatureList; 