const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Validate API key
if (!CLAUDE_API_KEY) {
  console.error('CLAUDE_API_KEY is not set in environment variables');
  process.exit(1);
}

// Claude API client
const claudeClient = axios.create({
  baseURL: 'https://api.anthropic.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': CLAUDE_API_KEY,
    'anthropic-version': '2023-06-01'
  }
});

// Extract tasks from text
app.post('/ai/extract-tasks', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }
    
    const prompt = `
      Extract all tasks and potential deadlines from the following text. 
      Format your response as a JSON object with a "tasks" array. 
      Each task should have a "description" field and an optional "deadline" field in ISO format (YYYY-MM-DD).
      Only include clear tasks, not general statements or questions.
      
      Text: ${text}
      
      Response (JSON only):
    `;
    
    const response = await claudeClient.post('/messages', {
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    });
    
    // Extract JSON from Claude's response
    const content = response.data.content[0].text;
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/({[\s\S]*})/);
    
    if (!jsonMatch) {
      return res.status(500).json({ message: 'Failed to parse AI response' });
    }
    
    const jsonResponse = JSON.parse(jsonMatch[1]);
    return res.json(jsonResponse);
    
  } catch (error) {
    console.error('Error extracting tasks:', error);
    return res.status(500).json({ 
      message: 'Error extracting tasks', 
      error: error.message 
    });
  }
});

// Extract tasks from image
app.post('/ai/extract-tasks-image', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ message: 'Image data is required' });
    }
    
    const prompt = `
      Look at this image and extract all tasks and potential deadlines that you can see.
      Format your response as a JSON object with a "tasks" array. 
      Each task should have a "description" field and an optional "deadline" field in ISO format (YYYY-MM-DD).
      Only include clear tasks, not general statements or questions.
      
      Response (JSON only):
    `;
    
    const response = await claudeClient.post('/messages', {
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [
        { 
          role: 'user', 
          content: [
            { type: 'text', text: prompt },
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } }
          ]
        }
      ]
    });
    
    // Extract JSON from Claude's response
    const content = response.data.content[0].text;
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/({[\s\S]*})/);
    
    if (!jsonMatch) {
      return res.status(500).json({ message: 'Failed to parse AI response' });
    }
    
    const jsonResponse = JSON.parse(jsonMatch[1]);
    return res.json(jsonResponse);
    
  } catch (error) {
    console.error('Error extracting tasks from image:', error);
    return res.status(500).json({ 
      message: 'Error extracting tasks from image', 
      error: error.message 
    });
  }
});

// Generate PRD
app.post('/ai/generate-prd', async (req, res) => {
  try {
    const { projectTitle, description } = req.body;
    
    if (!projectTitle || !description) {
      return res.status(400).json({ message: 'Project title and description are required' });
    }
    
    const prompt = `
      Generate a comprehensive Product Requirements Document (PRD) for the following project.
      Format your response in Markdown.
      
      Project Title: ${projectTitle}
      Project Description: ${description}
      
      Include the following sections:
      1. Overview
      2. Goals and Objectives
      3. User Stories
      4. Functional Requirements
      5. Non-Functional Requirements
      6. Technical Requirements
      7. Timeline and Milestones
      8. Success Metrics
      
      Make the PRD detailed but concise, focusing on clarity and actionable requirements.
    `;
    
    const response = await claudeClient.post('/messages', {
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    });
    
    // Extract content from Claude's response
    const content = response.data.content[0].text;
    
    return res.json({ content });
    
  } catch (error) {
    console.error('Error generating PRD:', error);
    return res.status(500).json({ 
      message: 'Error generating PRD', 
      error: error.message 
    });
  }
});

// Name conversation
app.post('/ai/name-conversation', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Conversation text is required' });
    }
    
    const prompt = `
      Based on the following conversation, generate a short, descriptive name (3-5 words maximum).
      The name should capture the essence of what was discussed.
      Return only the name, nothing else.
      
      Conversation: ${text}
    `;
    
    const response = await claudeClient.post('/messages', {
      model: 'claude-3-haiku-20240307',
      max_tokens: 50,
      messages: [{ role: 'user', content: prompt }]
    });
    
    // Extract content from Claude's response
    const name = response.data.content[0].text.trim();
    
    return res.json({ name });
    
  } catch (error) {
    console.error('Error naming conversation:', error);
    return res.status(500).json({ 
      message: 'Error naming conversation', 
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 