import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';
import App from './App';
import * as storageTest from './utils/storageTest';

// Make storage tests available in the browser console
declare global {
  interface Window {
    storageTest: typeof storageTest;
  }
}

window.storageTest = storageTest;

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333;
    background-color: #f5f7fa;
  }
  
  button {
    font-family: inherit;
  }
  
  /* Sortable styles */
  .sortable-ghost {
    opacity: 0.4;
    background-color: #f0f0f0;
  }
  
  .sortable-chosen {
    background-color: #f9f9f9;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .sortable-drag {
    opacity: 0.8;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
);
