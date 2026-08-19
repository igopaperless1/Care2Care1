import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initializeCapacitorBridge } from './services/capacitorBridge';
import './index.css';

// Initialize native Android Capacitor hooks if running in native app
initializeCapacitorBridge();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallbackTitle="Care2Care Application Recovery">
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  </StrictMode>,
);
