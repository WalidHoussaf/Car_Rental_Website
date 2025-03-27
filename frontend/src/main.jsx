import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CarProvider } from './context/CarContext';
import { BookingProvider } from './context/BookingContext';
import { NotificationProvider } from './context/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CarProvider>
        <BookingProvider>
          <NotificationProvider>
              <App />
          </NotificationProvider>
        </BookingProvider>
      </CarProvider>
    </AuthProvider>
  </BrowserRouter>
);