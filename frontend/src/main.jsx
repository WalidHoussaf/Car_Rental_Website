import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { CarProvider } from './context/CarContext.jsx';
import { BookingProvider } from './context/BookingContext';
import { NotificationProvider } from './context/NotificationContext';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { queryClient } from './config/queryClient';

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CarProvider>
          <BookingProvider>
            <NotificationProvider>
              <LanguageProvider>
                <App />
              </LanguageProvider>
            </NotificationProvider>
          </BookingProvider>
        </CarProvider>
      </AuthProvider>
    </BrowserRouter>
    {/* React Query Devtools - only in development */}
    {import.meta.env.MODE === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
);