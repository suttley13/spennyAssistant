import React from 'react';
import styled from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const getBackgroundColor = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary': return '#0066ff';
    case 'secondary': return '#6c757d';
    case 'danger': return '#dc3545';
    case 'success': return '#28a745';
    case 'outline': return 'transparent';
    default: return '#0066ff';
  }
};

const getHoverBackgroundColor = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary': return '#0055cc';
    case 'secondary': return '#5a6268';
    case 'danger': return '#c82333';
    case 'success': return '#218838';
    case 'outline': return 'rgba(0, 102, 255, 0.1)';
    default: return '#0055cc';
  }
};

const getTextColor = (variant: ButtonVariant) => {
  return variant === 'outline' ? '#0066ff' : '#fff';
};

const getBorderColor = (variant: ButtonVariant) => {
  return variant === 'outline' ? '#0066ff' : 'transparent';
};

const getPadding = (size: ButtonSize) => {
  switch (size) {
    case 'small': return '6px 12px';
    case 'medium': return '8px 16px';
    case 'large': return '10px 20px';
    default: return '8px 16px';
  }
};

const getFontSize = (size: ButtonSize) => {
  switch (size) {
    case 'small': return '0.875rem';
    case 'medium': return '1rem';
    case 'large': return '1.125rem';
    default: return '1rem';
  }
};

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $hasIcon: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${({ $size }) => getPadding($size)};
  font-size: ${({ $size }) => getFontSize($size)};
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: ${({ $variant }) => getBackgroundColor($variant)};
  color: ${({ $variant }) => getTextColor($variant)};
  border: 1px solid ${({ $variant }) => getBorderColor($variant)};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  
  &:hover:not(:disabled) {
    background-color: ${({ $variant }) => getHoverBackgroundColor($variant)};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.25);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  children,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $hasIcon={!!icon}
      {...props}
    >
      {icon}
      {children}
    </StyledButton>
  );
};

export default Button; 