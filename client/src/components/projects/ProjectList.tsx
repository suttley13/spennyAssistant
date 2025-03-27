import React, { useState } from 'react';
import styled from 'styled-components';
import { Item } from '../../types';
import { useTaskContext } from '../../context/TaskContext';
import { useSortable } from '../../hooks/useSortable';
import ItemCard from '../common/ItemCard';
import SectionHeader from '../common/SectionHeader';
import Modal from '../common/Modal';
import ItemForm from '../common/ItemForm';
import PrdEditor from '../prd/PrdEditor';
import * as storageService from '../../services/storage';
import SortableList from '../common/SortableList';

const ProjectListContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: auto;
  overflow: visible;
`;

const ProjectListContent = styled.div`
  width: 100%;
  overflow: visible;
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

const ProjectList: React.FC = () => {
  const { projects, addItem, updateItem, deleteItem, reorderItems, shipItem } = useTaskContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isPrdModalOpen, setIsPrdModalOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  
  // Sort projects by order
  const sortedProjects = [...projects].sort((a, b) => a.order - b.order);
  
  // Ref for sortable container
  const projectListRef = useSortable({
    itemsKey: 'projects',
    items: sortedProjects,
    onOrderChange: (items) => {
      reorderItems(items, 'Project');
    }
  });
  
  const handleAddProject = () => {
    setEditingItem(null);
    setIsAddModalOpen(true);
  };
  
  const handleEditProject = (project: Item) => {
    setEditingItem(project);
    setIsAddModalOpen(true);
  };
  
  const handleSubmitProject = (projectData: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
    if (editingItem) {
      updateItem({ ...editingItem, ...projectData });
    } else {
      addItem(projectData);
    }
    setIsAddModalOpen(false);
    setEditingItem(null);
  };
  
  const handleDeleteProject = (id: string) => {
    setConfirmDelete(id);
  };
  
  const confirmDeleteProject = () => {
    if (confirmDelete) {
      deleteItem(confirmDelete, 'Project');
      setConfirmDelete(null);
    }
  };
  
  const handleDeadlineChange = (id: string, deadline: string | null) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      updateItem({ ...project, deadline });
    }
  };
  
  const handleEditPrd = (projectId: string) => {
    setCurrentProjectId(projectId);
    setIsPrdModalOpen(true);
  };
  
  const handleSavePrd = (content: string) => {
    if (currentProjectId) {
      // Save PRD content to storage
      storageService.savePrdContentForTask(currentProjectId, content);
      
      // Close the modal
      setIsPrdModalOpen(false);
      setCurrentProjectId(null);
    }
  };
  
  return (
    <>
      <ProjectListContainer>
        <SectionHeader 
          title="Projects" 
          type="Project" 
          onAddItem={handleAddProject} 
        />
        
        <ProjectListContent ref={projectListRef as React.RefObject<HTMLDivElement>}>
          {sortedProjects.length === 0 ? (
            <EmptyState>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <p>No projects yet. Add your first project by clicking the + button above.</p>
            </EmptyState>
          ) : (
            sortedProjects.map(project => (
              <ItemCard 
                key={project.id}
                item={project}
                onEdit={() => handleEditProject(project)}
                onDelete={() => handleDeleteProject(project.id)}
                onShip={() => shipItem(project.id, 'Project')}
                onEditPrd={() => handleEditPrd(project.id)}
                onDeadlineChange={(deadline) => handleDeadlineChange(project.id, deadline)}
              />
            ))
          )}
        </ProjectListContent>
      </ProjectListContainer>
      
      {/* Add/Edit Project Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Project' : 'Add Project'}
      >
        <ItemForm
          item={editingItem || undefined}
          itemType="Project"
          onSubmit={handleSubmitProject}
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
              onClick={confirmDeleteProject}
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
        <p>Are you sure you want to delete this project? This action cannot be undone.</p>
      </Modal>
      
      {/* PRD Editor Modal */}
      {currentProjectId && (
        <Modal
          isOpen={isPrdModalOpen}
          onClose={() => {
            setIsPrdModalOpen(false);
            setCurrentProjectId(null);
          }}
          title="Edit PRD"
        >
          <PrdEditor 
            projectId={currentProjectId}
            initialContent={storageService.getPrdContentForTask(currentProjectId) || ''}
            onSave={handleSavePrd}
            onCancel={() => {
              setIsPrdModalOpen(false);
              setCurrentProjectId(null);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default ProjectList; 