import React from 'react';
import styled from 'styled-components';
import { useTaskContext } from '../../context/TaskContext';
import { isFirebaseConfigured } from '../../services/firebase';

const StorageToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  padding: 0 16px;
`;

const ModeIndicator = styled.div<{ mode: 'firebase' | 'local' }>`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: ${(props) => (props.mode === 'firebase' ? '#4285F4' : '#666')};
  margin-right: 8px;
`;

const ToggleButton = styled.button`
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e9e9e9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StorageToggle: React.FC = () => {
  const { storageMode, toggleStorageMode, isLoading } = useTaskContext();
  const firebaseAvailable = isFirebaseConfigured();
  
  const handleToggle = () => {
    toggleStorageMode();
  };
  
  return (
    <StorageToggleContainer>
      <ModeIndicator mode={storageMode}>
        <span>
          {storageMode === 'firebase' ? 'Firebase Storage' : 'Local Storage'}
        </span>
      </ModeIndicator>
      
      {firebaseAvailable && (
        <ToggleButton onClick={handleToggle} disabled={isLoading}>
          Switch to {storageMode === 'firebase' ? 'Local Storage' : 'Firebase Storage'}
        </ToggleButton>
      )}
      
      {!firebaseAvailable && storageMode === 'local' && (
        <ToggleButton disabled>
          Firebase Not Configured
        </ToggleButton>
      )}
    </StorageToggleContainer>
  );
};

export default StorageToggle; 