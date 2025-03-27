import React, { useState } from 'react';
import styled from 'styled-components';
import { useTaskContext } from '../../context/TaskContext';
import ItemCard from '../common/ItemCard';
import Button from '../common/Button';
import Modal from '../common/Modal';

const ShippedContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
`;

const ShippedButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #00c853;
  color: white;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

// Custom Modal Container to make it larger with 80px margins
const CustomModalContainer = styled.div`
  width: calc(100% - 160px);
  height: calc(100% - 160px);
  max-width: calc(100% - 160px);
  max-height: calc(100% - 160px);
  display: flex;
  flex-direction: column;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow: hidden;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #0066ff;
    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background-color: ${props => props.active ? '#0066ff' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  
  &:hover {
    background-color: ${props => props.active ? '#0055cc' : '#e9e9e9'};
  }
`;

const ShippedListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const ShippedItemRow = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

const TypeIndicator = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 12px;
  flex-shrink: 0;
`;

const ItemContent = styled.div`
  flex: 1;
`;

const Description = styled.div`
  font-size: 14px;
  margin-bottom: 4px;
`;

const ItemMeta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
`;

const DateInfo = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const UnshipButton = styled.button`
  background: none;
  border: none;
  color: #f44336;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(244, 67, 54, 0.1);
  }
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

const getTypeColor = (type: 'Task' | 'Project' | 'Feature') => {
  switch (type) {
    case 'Task': return '#72bf78';
    case 'Project': return '#00aeff';
    case 'Feature': return '#6c48c5';
    default: return '#72bf78';
  }
};

const ShippedListComponent: React.FC = () => {
  const { shipped, unshipItem } = useTaskContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'Task' | 'Project' | 'Feature'>('all');
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSearchTerm('');
    setFilter('all');
  };
  
  const handleUnship = (id: string) => {
    unshipItem(id);
  };
  
  // Filter and sort shipped items
  const filteredItems = shipped
    .filter(item => 
      (filter === 'all' || item.type === filter) &&
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.dateShipped).getTime() - new Date(a.dateShipped).getTime());
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <>
      <ShippedContainer>
        <ShippedButton onClick={handleOpenModal} title="View shipped items">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </ShippedButton>
      </ShippedContainer>
      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Shipped Items"
      >
        <CustomModalContainer>
          <ModalContent>
            <SearchContainer>
              <SearchInput 
                type="text" 
                placeholder="Search shipped items..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
            
            <FilterContainer>
              <FilterButton 
                active={filter === 'all'} 
                onClick={() => setFilter('all')}
              >
                All
              </FilterButton>
              <FilterButton 
                active={filter === 'Task'} 
                onClick={() => setFilter('Task')}
              >
                Tasks
              </FilterButton>
              <FilterButton 
                active={filter === 'Project'} 
                onClick={() => setFilter('Project')}
              >
                Projects
              </FilterButton>
              <FilterButton 
                active={filter === 'Feature'} 
                onClick={() => setFilter('Feature')}
              >
                Features
              </FilterButton>
            </FilterContainer>
            
            <ShippedListContainer>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <ShippedItemRow key={item.id}>
                    <TypeIndicator color={getTypeColor(item.type)} />
                    <ItemContent>
                      <Description>{item.description}</Description>
                      <ItemMeta>
                        <DateInfo>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          Shipped on {formatDate(item.dateShipped)}
                        </DateInfo>
                        {item.type}
                      </ItemMeta>
                    </ItemContent>
                    <UnshipButton 
                      onClick={() => handleUnship(item.id)}
                      title="Move back to active"
                    >
                      Unship
                    </UnshipButton>
                  </ShippedItemRow>
                ))
              ) : (
                <EmptyState>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V9l-7-7z"></path>
                    <path d="M13 3v6h6"></path>
                  </svg>
                  <p>No shipped items found.</p>
                  <p>Shipped items will appear here when you mark tasks, projects, or features as shipped.</p>
                </EmptyState>
              )}
            </ShippedListContainer>
          </ModalContent>
        </CustomModalContainer>
      </Modal>
    </>
  );
};

export default ShippedListComponent; 