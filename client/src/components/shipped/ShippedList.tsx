import React, { useState } from 'react';
import styled from 'styled-components';
import { useTaskContext } from '../../context/TaskContext';
import ItemCard from '../common/ItemCard';
import Button from '../common/Button';

const ShippedContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 100;
  padding: 20px;
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

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  max-height: 400px;
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
      
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Shipped Items</h2>
              <button className="close-button" onClick={handleCloseModal}>×</button>
            </div>
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
                {filteredItems.length === 0 ? (
                  <EmptyState>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                    <p>No shipped items found. Ship items by clicking the ship button on tasks, projects, or features.</p>
                  </EmptyState>
                ) : (
                  filteredItems.map(item => (
                    <ShippedItemRow key={item.id}>
                      <TypeIndicator color={getTypeColor(item.type)} />
                      <ItemContent>
                        <Description>{item.description}</Description>
                        <ItemMeta>
                          <DateInfo>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14"></path>
                              <path d="M12 5l7 7-7 7"></path>
                            </svg>
                            Shipped: {formatDate(item.dateShipped)}
                          </DateInfo>
                          <span>{item.type}</span>
                        </ItemMeta>
                      </ItemContent>
                      <UnshipButton onClick={() => handleUnship(item.id)}>
                        Unship
                      </UnshipButton>
                    </ShippedItemRow>
                  ))
                )}
              </ShippedListContainer>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outline" onClick={handleCloseModal}>
                  Close
                </Button>
              </div>
            </ModalContent>
          </div>
        </div>
      )}
    </>
  );
};

export default ShippedListComponent; 