import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './router';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DndProvider backend={HTML5Backend}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </DndProvider>
  </StrictMode>,
);
