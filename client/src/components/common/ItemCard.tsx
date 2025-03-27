import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Item, Project } from '../../types';
import DatePicker from './DatePicker';

interface ItemCardProps {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
  onShip: () => void;
  onEditPrd?: () => void; // Only for projects
  onDeadlineChange: (deadline: string | null) => void;
}

const getTypeColor = (type: 'Task' | 'Project' | 'Feature') => {
  switch (type) {
    case 'Task': return '#72bf78';
    case 'Project': return '#00aeff';
    case 'Feature': return '#6c48c5';
    default: return '#72bf78';
  }
};

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
  position: relative;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f9f9f9;
  }
  
  &:hover .item-actions {
    opacity: 1;
  }
`;

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  color: #aaa;
  cursor: grab;
  margin-right: 12px;
  
  &:active {
    cursor: grabbing;
  }
  
  svg {
    width: 16px;
    height: 16px;
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
  min-width: 0;
  display: flex;
  align-items: center;
`;

const Description = styled.div`
  font-size: 14px;
  word-break: break-word;
  line-height: 1.4;
`;

const ItemLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 0;
  margin-left: 12px;
  align-items: center;
`;

const LinkPill = styled.a<{ color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  text-decoration: none;
  background-color: rgba(25, 118, 210, 0.1);
  border: 1px solid rgba(25, 118, 210, 0.7);
  color: ${props => props.color};
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &:hover {
    background-color: rgba(25, 118, 210, 0.15);
  }
`;

const EmptyLinkPill = styled.button<{ color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  background: none;
  border: 1px dashed ${props => props.color};
  color: ${props => props.color};
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-left: 8px;
  min-width: 120px;
  justify-content: flex-end;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  right: 0;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 4px;
  border-radius: 4px;
  z-index: 10;
`;

const ActionButton = styled.button<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.color || '#666'};
  padding: 2px 6px;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const DatePickerModal = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 8px;
  z-index: 20;
`;

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onShip,
  onEditPrd,
  onDeadlineChange
}) => {
  const typeColor = getTypeColor(item.type);
  const project = item.type === 'Project' ? item as Project : null;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onDeadlineChange(e.target.value);
      setShowDatePicker(false);
    }
  };
  
  const openDatePicker = () => {
    setShowDatePicker(true);
  };
  
  const closeDatePicker = () => {
    setShowDatePicker(false);
  };
  
  // Handle clicks outside of the date picker
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDatePicker && 
        dateButtonRef.current && 
        !dateButtonRef.current.contains(event.target as Node)
      ) {
        closeDatePicker();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);
  
  // Display deadline if it exists
  let formattedDeadline = '';
  if (item.deadline) {
    const date = new Date(item.deadline);
    formattedDeadline = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }
  
  return (
    <CardContainer>
      <DragHandle className="drag-handle">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 16 19" 
          fill="#aaa"
          style={{ 
            opacity: 0.6
          }}
        >
          <circle cx="5" cy="3" r="1.5" />
          <circle cx="5" cy="9" r="1.5" />
          <circle cx="5" cy="15" r="1.5" />
          <circle cx="11" cy="3" r="1.5" />
          <circle cx="11" cy="9" r="1.5" />
          <circle cx="11" cy="15" r="1.5" />
        </svg>
      </DragHandle>
      
      <TypeIndicator color={typeColor} />
      
      <ItemContent>
        <Description>{item.description}</Description>
        
        {/* Project-specific links */}
        {item.type === 'Project' && project && (
          <ItemLinks>
            {project?.prdLink ? (
              <LinkPill 
                href={project.prdLink} 
                target="_blank" 
                rel="noopener noreferrer"
                color="#9c27b0"
                title="PRD Document"
              >
                PRD
              </LinkPill>
            ) : (
              <EmptyLinkPill 
                color="#9c27b0"
                onClick={onEditPrd}
                type="button"
              >
                + PRD
              </EmptyLinkPill>
            )}
            
            {project?.figmaLink ? (
              <LinkPill 
                href={project.figmaLink} 
                target="_blank" 
                rel="noopener noreferrer"
                color="#ec407a"
                title="Figma Design"
              >
                Figma
              </LinkPill>
            ) : (
              <EmptyLinkPill 
                color="#ec407a"
                onClick={onEdit}
                type="button"
              >
                + Figma
              </EmptyLinkPill>
            )}
            
            {project?.jiraLink ? (
              <LinkPill 
                href={project.jiraLink} 
                target="_blank" 
                rel="noopener noreferrer"
                color="#1565c0"
                title="Jira Ticket"
              >
                Jira
              </LinkPill>
            ) : (
              <EmptyLinkPill 
                color="#1565c0"
                onClick={onEdit}
                type="button"
              >
                + Jira
              </EmptyLinkPill>
            )}
            
            {project?.launchPostLink ? (
              <LinkPill 
                href={project.launchPostLink} 
                target="_blank" 
                rel="noopener noreferrer"
                color="#ff5722"
                title="Launch Post"
              >
                Launch
              </LinkPill>
            ) : (
              <EmptyLinkPill 
                color="#ff5722"
                onClick={onEdit}
                type="button"
              >
                + Launch
              </EmptyLinkPill>
            )}
          </ItemLinks>
        )}
        
        {/* Regular links */}
        {item.links && item.links.length > 0 && (
          <ItemLinks>
            {item.links.map((link, index) => (
              <LinkPill 
                key={index}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                color="#607d8b"
                title={link.url}
              >
                {link.title}
              </LinkPill>
            ))}
          </ItemLinks>
        )}
      </ItemContent>
      
      <RightContainer>
        <DatePicker 
          selectedDate={item.deadline} 
          onChange={onDeadlineChange}
        />
        
        <ItemActions className="item-actions">
          {item.deadline ? (
            <ActionButton onClick={() => onDeadlineChange(null)} color="#f44336" title="Remove Date">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <line x1="8" y1="16" x2="16" y2="16"></line>
              </svg>
            </ActionButton>
          ) : (
            <ActionButton 
              onClick={openDatePicker} 
              color="#1976d2" 
              title="Add Date"
              ref={dateButtonRef}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              
              {showDatePicker && (
                <DatePickerModal onClick={e => e.stopPropagation()}>
                  <input
                    type="date"
                    onChange={handleDateChange}
                    autoFocus
                    style={{ 
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                </DatePickerModal>
              )}
            </ActionButton>
          )}
          
          <ActionButton onClick={onEdit} title="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </ActionButton>
          
          <ActionButton onClick={onShip} color="#4caf50" title="Ship">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </ActionButton>
          
          <ActionButton onClick={onDelete} color="#f44336" title="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </ActionButton>
        </ItemActions>
      </RightContainer>
    </CardContainer>
  );
};

export default ItemCard; 