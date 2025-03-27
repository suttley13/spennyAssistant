import React, { useRef } from 'react';
import styled from 'styled-components';

interface DatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  placeholder?: string;
}

const DatePickerContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DateButton = styled.button<{ hasDate: boolean }>`
  display: ${({ hasDate }) => (hasDate ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  border: 1px solid #dddddd;
  background-color: #f5f5f5;
  color: #666;
  min-width: 24px;
  min-height: 24px;
  width: 120px;
  margin-left: auto;
  
  &:hover {
    border-color: #1976d2;
  }
`;

const CalendarIcon = () => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const RemoveButton = styled.button`
  border: none;
  background: none;
  color: #f44336;
  cursor: pointer;
  margin-left: 4px;
  font-size: 14px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  
  ${DateButton}:hover & {
    opacity: 1;
  }
  
  &:hover {
    color: #d32f2f;
  }
`;

const DatePicker: React.FC<{
  selectedDate: string | null;
  onChange: (date: string | null) => void;
  disabled?: boolean;
  className?: string;
  onPickerOpen?: () => void;
}> = ({ 
  selectedDate, 
  onChange, 
  disabled = false,
  className,
  onPickerOpen
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event from propagating up
    inputRef.current?.showPicker();
    onPickerOpen?.();
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onChange(e.target.value);
    }
  };
  
  const handleRemoveDate = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event from propagating up
    onChange(null);
  };
  
  const formatDate = (dateString: string) => {
    // Parse the date string (YYYY-MM-DD) into its components
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    
    // JavaScript months are 0-indexed, so subtract 1 from the month
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  return (
    <DatePickerContainer>
      <DateButton 
        hasDate={!!selectedDate} 
        onClick={handleButtonClick}
        type="button" // Explicitly set as button type to prevent form submission
      >
        {selectedDate && formatDate(selectedDate)}
      </DateButton>
      <HiddenInput
        ref={inputRef}
        type="date"
        value={selectedDate || ''}
        onChange={handleDateChange}
      />
    </DatePickerContainer>
  );
};

export default DatePicker; 