import React from 'react';
import styled from 'styled-components';
import { TaskProvider } from './context/TaskContext';
import TaskList from './components/tasks/TaskList';
import ProjectList from './components/projects/ProjectList';
import FeatureList from './components/features/FeatureList';
import ShippedList from './components/shipped/ShippedList';

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
  padding: 6px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 200;
  font-family: 'Poppins', sans-serif;
`;

const CodeIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 1200 1200" 
    fill="white" 
    stroke="black" 
    strokeWidth="60"
    style={{ 
      display: 'block',
      position: 'relative'
    }}
  >
    <path d="m340.78 340.78c-20.391-20.391-52.781-20.391-73.219 0l-221.95 222c-20.391 20.391-20.391 52.781 0 73.219l222 222c9.6094 9.6094 24 15.609 37.219 15.609s26.391-4.7812 37.219-15.609c20.391-20.391 20.391-52.781 0-73.219l-186.05-184.78 184.78-184.78c20.438-20.438 20.438-54 0-74.438z"/>
    <path d="m932.39 340.78c-20.391-20.391-52.781-20.391-73.219 0-20.391 20.391-20.391 52.781 0 73.219l184.82 186-184.78 184.78c-20.391 20.391-20.391 52.781 0 73.219 9.6094 9.6094 24 15.609 37.219 15.609s26.391-4.7812 37.219-15.609l222-222c20.391-20.391 20.391-52.781 0-73.219z"/>
    <path d="m718.78 330c-26.391-12-57.609 0-68.391 26.391l-194.39 444c-12 26.391 0 57.609 26.391 68.391 7.2188 3.6094 14.391 4.7812 20.391 4.7812 20.391 0 39.609-12 48-31.219l194.39-444c12.047-25.125 0.046875-56.344-26.391-68.344z"/>
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
            <CodeIcon />
            Spenny Assistant
          </Logo>
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
