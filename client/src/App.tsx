import React from 'react';
import styled from 'styled-components';
import { TaskProvider } from './context/TaskContext';
import TaskList from './components/tasks/TaskList';
import ProjectList from './components/projects/ProjectList';
import FeatureList from './components/features/FeatureList';
import ShippedList from './components/shipped/ShippedList';
import StorageToggle from './components/common/StorageToggle';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

const Header = styled.header`
  background-color: #000000;
  color: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 700;
  font-family: 'Outfit', sans-serif;
`;

const GlitterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const HeaderButton = styled.button`
  background-color: transparent;
  color: white;
  border: 1px solid white;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  width: 66%;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    width: 90%;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const App: React.FC = () => {
  return (
    <TaskProvider>
      <AppContainer>
        <Header>
          <Logo>
            <GlitterIcon />
            Spenny Assistant
          </Logo>
          <StorageToggle />
          <HeaderActions>
            <HeaderButton>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Extract Tasks
            </HeaderButton>
            <HeaderButton>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              Extract from Image
            </HeaderButton>
          </HeaderActions>
        </Header>
        
        <MainContent>
          <LeftColumn>
            <TaskList />
          </LeftColumn>
          <RightColumn>
            <ProjectList />
            <FeatureList />
          </RightColumn>
        </MainContent>
        
        <ShippedList />
      </AppContainer>
    </TaskProvider>
  );
};

export default App;
