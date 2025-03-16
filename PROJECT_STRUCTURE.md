# Spenny Assistant Project Structure

This document provides an overview of the project structure to help developers understand the organization of the codebase.

## Root Directory

- `package.json` - Root package with scripts to run both client and server
- `setup.sh` - Setup script for Unix/Mac
- `setup.bat` - Setup script for Windows
- `README.md` - Project documentation
- `LICENSE` - MIT License
- `.gitignore` - Git ignore file

## Client Directory (`/client`)

The client is a React application built with Vite and TypeScript.

### Core Files

- `package.json` - Client dependencies and scripts
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `.env.example` - Example environment variables
- `index.html` - HTML entry point

### Source Directory (`/client/src`)

- `main.tsx` - Application entry point with global styles
- `App.tsx` - Main application component and layout
- `vite-env.d.ts` - Vite environment type definitions

### Components

- `/components`
  - `/common` - Reusable UI components
    - `Button.tsx` - Button component
    - `DatePicker.tsx` - Date picker component
    - `ItemCard.tsx` - Card component for displaying items
    - `ItemForm.tsx` - Form for creating/editing items
    - `Modal.tsx` - Modal dialog component
    - `SectionHeader.tsx` - Section header with title and add button
  - `/tasks` - Task-related components
    - `TaskList.tsx` - List of tasks with management functionality
  - `/projects` - Project-related components
    - `ProjectList.tsx` - List of projects with management functionality
  - `/features` - Feature-related components
    - `FeatureList.tsx` - List of features with management functionality
  - `/prd` - PRD-related components
    - `PrdEditor.tsx` - Markdown editor for PRDs
  - `/shipped` - Shipped items components
    - `ShippedList.tsx` - List of shipped items with filtering

### Hooks

- `/hooks`
  - `useLocalStorage.ts` - Hook for persistent storage
  - `useSortable.ts` - Hook for drag-and-drop functionality

### Context

- `/context`
  - `TaskContext.tsx` - Context for managing tasks, projects, and features

### Services

- `/services`
  - `api.ts` - API service for AI integrations

### Types

- `/types`
  - `index.ts` - TypeScript type definitions

### Utilities

- `/utils`
  - `helpers.ts` - Helper functions

## Server Directory (`/server`)

The server is an Express.js application that serves as an API proxy.

### Core Files

- `package.json` - Server dependencies and scripts
- `server.js` - Express server with API endpoints
- `.env.example` - Example environment variables

### API Endpoints

- `/ai/extract-tasks` - Extract tasks from text
- `/ai/extract-tasks-image` - Extract tasks from images
- `/ai/generate-prd` - Generate PRD from project details
- `/ai/name-conversation` - Generate a name for a conversation 