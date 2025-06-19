import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { I18nextProvider } from 'react-i18next';

import App from './App.tsx';
import './index.css';
import i18n from './l10n/i18n.js';


import { ThemeProvider } from './context/ThemeContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { ArticleModalProvider } from './context/ArticleModalContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <AuthProvider>
            <ArticleModalProvider>
              <App />
              <Toaster 
                position="top-right" 
                toastOptions={{
                  className: 'dark:bg-gemini-surface-dark dark:text-gemini-text-dark',
                }}
              />
            </ArticleModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nextProvider>
    </BrowserRouter>
  </React.StrictMode>,
);