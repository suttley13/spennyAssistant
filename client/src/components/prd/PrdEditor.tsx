import React, { useState } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import Button from '../common/Button';

interface PrdEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent?: string;
  projectTitle: string;
}

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 60vh;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  background: ${props => props.active ? '#f5f5f5' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#0066ff' : 'transparent'};
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : 'normal'};
  color: ${props => props.active ? '#0066ff' : '#333'};
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

const TextArea = styled.textarea`
  flex: 1;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  
  &:focus {
    outline: none;
    border-color: #0066ff;
    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
  }
`;

const PreviewContainer = styled.div`
  flex: 1;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow-y: auto;
  background-color: #fff;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }
  
  h1 {
    font-size: 2em;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }
  
  h2 {
    font-size: 1.5em;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }
  
  h3 {
    font-size: 1.25em;
  }
  
  p, blockquote, ul, ol, dl, table {
    margin-top: 0;
    margin-bottom: 16px;
  }
  
  ul, ol {
    padding-left: 2em;
  }
  
  li {
    margin-top: 0.25em;
  }
  
  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  }
  
  pre {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 3px;
    
    code {
      padding: 0;
      margin: 0;
      background-color: transparent;
      border: 0;
    }
  }
  
  blockquote {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
  }
  
  table {
    border-spacing: 0;
    border-collapse: collapse;
    
    th, td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }
    
    tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
    }
    
    tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const PrdEditor: React.FC<PrdEditorProps> = ({ 
  isOpen, 
  onClose, 
  initialContent = '', 
  projectTitle,
}) => {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const handleSave = () => {
    // Implementation of handleSave
  };
  
  return (
    <EditorContainer>
      <TabContainer>
        <Tab 
          active={activeTab === 'edit'} 
          onClick={() => setActiveTab('edit')}
        >
          Edit
        </Tab>
        <Tab 
          active={activeTab === 'preview'} 
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </Tab>
      </TabContainer>
      
      {activeTab === 'edit' ? (
        <TextArea 
          value={content} 
          onChange={handleContentChange}
          placeholder="# Project Requirements Document

## Overview
Brief description of the project.

## Goals
- Goal 1
- Goal 2

## Requirements
### Functional Requirements
1. Requirement 1
2. Requirement 2

### Non-Functional Requirements
1. Performance
2. Security

## Timeline
- Milestone 1: Date
- Milestone 2: Date

## Resources
- [Link 1](url)
- [Link 2](url)
"
        />
      ) : (
        <PreviewContainer>
          <ReactMarkdown>{content}</ReactMarkdown>
        </PreviewContainer>
      )}
      
      <ButtonContainer>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save PRD
        </Button>
      </ButtonContainer>
    </EditorContainer>
  );
};

export default PrdEditor; 