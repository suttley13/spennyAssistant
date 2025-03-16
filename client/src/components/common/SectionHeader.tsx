import React from 'react';
import styled from 'styled-components';

interface SectionHeaderProps {
  title: string;
  type: 'Task' | 'Project' | 'Feature';
  onAddItem: () => void;
}

const getGradient = (type: 'Task' | 'Project' | 'Feature') => {
  switch (type) {
    case 'Task':
      return 'linear-gradient(90deg, rgba(114,191,120,1) 0%, rgba(211,238,152,1) 50%, rgba(160,214,131,1) 100%)';
    case 'Project':
      return 'linear-gradient(90deg, rgba(0,174,255,1) 0%, rgba(110,208,254,1) 50%, rgba(17,37,246,1) 100%)';
    case 'Feature':
      return 'linear-gradient(90deg, rgba(108,72,197,1) 0%, rgba(18,48,174,1) 50%, rgba(198,143,230,1) 100%)';
    default:
      return 'linear-gradient(90deg, rgba(114,191,120,1) 0%, rgba(211,238,152,1) 50%, rgba(160,214,131,1) 100%)';
  }
};

const HeaderContainer = styled.div<{ gradient: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: ${props => props.gradient};
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const AddButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 20px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  type, 
  onAddItem 
}) => {
  return (
    <HeaderContainer gradient={getGradient(type)}>
      <Title>{title}</Title>
      <AddButton onClick={onAddItem} title={`Add ${type}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </AddButton>
    </HeaderContainer>
  );
};

export default SectionHeader; 