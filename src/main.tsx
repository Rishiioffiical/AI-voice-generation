import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

// Prevent third-party browser extension injection scripts (chrome-extension://) from triggering app error overlays
if (typeof window !== 'undefined') {
  window.addEventListener(
    'error',
    (event) => {
      const source = event.filename || '';
      const stack = event.error?.stack || '';
      if (
        source.startsWith('chrome-extension://') ||
        source.startsWith('moz-extension://') ||
        stack.includes('chrome-extension://') ||
        stack.includes('moz-extension://')
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);
