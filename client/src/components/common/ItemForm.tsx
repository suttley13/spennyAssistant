import React, { useState } from 'react';
import styled from 'styled-components';
import { Item } from '../../types';
import DatePicker from './DatePicker';
import Button from './Button';

interface ItemFormProps {
  item?: Item;
  itemType: 'Task' | 'Project' | 'Feature';
  onSubmit: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  onCancel: () => void;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 14px;
  color: #333;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #0066ff;
    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
  }
`;

const Input = styled.input`
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

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LinkRow = styled.div`
  display: flex;
  gap: 8px;
`;

const RemoveLinkButton = styled.button`
  background: none;
  border: none;
  color: #f44336;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #d32f2f;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`;

const ItemForm: React.FC<ItemFormProps> = ({ 
  item, 
  itemType, 
  onSubmit, 
  onCancel 
}) => {
  const [description, setDescription] = useState(item?.description || '');
  const [deadline, setDeadline] = useState<string | null>(item?.deadline || null);
  const [links, setLinks] = useState<Array<{url: string, title: string}>>(
    item?.links || []
  );
  
  // Project specific fields
  const [prdLink, setPrdLink] = useState((item as any)?.prdLink || '');
  const [figmaLink, setFigmaLink] = useState((item as any)?.figmaLink || '');
  const [jiraLink, setJiraLink] = useState((item as any)?.jiraLink || '');
  const [launchPostLink, setLaunchPostLink] = useState((item as any)?.launchPostLink || '');
  
  const handleAddLink = () => {
    setLinks([...links, { url: '', title: '' }]);
  };
  
  const handleLinkChange = (index: number, field: 'url' | 'title', value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };
  
  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty links
    const filteredLinks = links.filter(link => link.url.trim() !== '' && link.title.trim() !== '');
    
    const formData: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'order'> = {
      description,
      type: itemType,
      deadline,
      links: filteredLinks,
    };
    
    // Add project-specific fields if it's a project
    if (itemType === 'Project') {
      Object.assign(formData, {
        prdLink: prdLink || undefined,
        figmaLink: figmaLink || undefined,
        jiraLink: jiraLink || undefined,
        launchPostLink: launchPostLink || undefined,
      });
    }
    
    onSubmit(formData);
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="description">Description</Label>
        <TextArea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={`Enter ${itemType.toLowerCase()} description`}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Deadline</Label>
        <DatePicker 
          value={deadline} 
          onChange={setDeadline}
          placeholder="Set deadline (optional)"
        />
      </FormGroup>
      
      {itemType === 'Project' && (
        <>
          <FormGroup>
            <Label htmlFor="prdLink">PRD Link</Label>
            <Input
              id="prdLink"
              type="url"
              value={prdLink}
              onChange={(e) => setPrdLink(e.target.value)}
              placeholder="Enter PRD URL (optional)"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="figmaLink">Figma Link</Label>
            <Input
              id="figmaLink"
              type="url"
              value={figmaLink}
              onChange={(e) => setFigmaLink(e.target.value)}
              placeholder="Enter Figma URL (optional)"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="jiraLink">Jira Link</Label>
            <Input
              id="jiraLink"
              type="url"
              value={jiraLink}
              onChange={(e) => setJiraLink(e.target.value)}
              placeholder="Enter Jira URL (optional)"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="launchPostLink">Launch Post Link</Label>
            <Input
              id="launchPostLink"
              type="url"
              value={launchPostLink}
              onChange={(e) => setLaunchPostLink(e.target.value)}
              placeholder="Enter Launch Post URL (optional)"
            />
          </FormGroup>
        </>
      )}
      
      <FormGroup>
        <Label>
          Additional Links
          <Button 
            type="button" 
            variant="outline" 
            size="small" 
            onClick={handleAddLink}
            style={{ marginLeft: '10px' }}
          >
            + Add Link
          </Button>
        </Label>
        
        <LinksContainer>
          {links.map((link, index) => (
            <LinkRow key={index}>
              <Input
                type="text"
                value={link.title}
                onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                placeholder="Link title"
                style={{ flex: 1 }}
              />
              <Input
                type="url"
                value={link.url}
                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                placeholder="URL"
                style={{ flex: 2 }}
              />
              <RemoveLinkButton 
                type="button" 
                onClick={() => handleRemoveLink(index)}
              >
                ×
              </RemoveLinkButton>
            </LinkRow>
          ))}
        </LinksContainer>
      </FormGroup>
      
      <ButtonGroup>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {item ? 'Update' : 'Create'} {itemType}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default ItemForm; 