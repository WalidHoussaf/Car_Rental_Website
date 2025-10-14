import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React, { createContext } from 'react';

// Create mock contexts
const AuthContext = createContext(null);
const CarContext = createContext(null);
const BookingContext = createContext(null);
const LanguageContext = createContext(null);
const NotificationContext = createContext(null);

// Mock providers for testing
const MockAuthProvider = ({ children, initialState }) => {
  const value = initialState || {
    isAuthenticated: false,
    user: null,
    login: () => {},
    logout: () => {},
    register: () => {}
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const MockCarProvider = ({ children }) => {
  const value = {
    cars: [],
    featuredCars: [],
    selectedCar: null,
    loading: false,
    fetchCars: () => {},
    fetchCarById: () => {}
  };
  return <CarContext.Provider value={value}>{children}</CarContext.Provider>;
};

const MockBookingProvider = ({ children }) => {
  const value = {
    bookings: [],
    currentBooking: null,
    loading: false,
    createBooking: () => {},
    fetchBookings: () => {}
  };
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

const MockLanguageProvider = ({ children }) => {
  const value = {
    language: 'en',
    setLanguage: () => {},
    toggleLanguage: () => {},
    isFrench: false
  };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

const MockNotificationProvider = ({ children }) => {
  const value = {
    showNotification: () => {},
    showSuccess: () => {},
    showError: () => {},
    showWarning: () => {}
  };
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// Custom render function with all providers
export function renderWithProviders(ui, options = {}) {
  const {
    initialAuthState = null,
    route = '/',
    ...renderOptions
  } = options;

  // Set initial route
  window.history.pushState({}, 'Test page', route);

  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <MockNotificationProvider>
          <MockLanguageProvider>
            <MockAuthProvider initialState={initialAuthState}>
              <MockCarProvider>
                <MockBookingProvider>
                  {children}
                </MockBookingProvider>
              </MockCarProvider>
            </MockAuthProvider>
          </MockLanguageProvider>
        </MockNotificationProvider>
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock user data
export const mockUser = {
  _id: '123456789',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  role: 'user',
  isEmailVerified: true
};

export const mockAdmin = {
  _id: '987654321',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  role: 'admin',
  isEmailVerified: true
};

// Mock car data
export const mockCar = {
  _id: 'car123',
  name: 'Toyota Camry 2024',
  brand: 'Toyota',
  model: 'Camry',
  year: 2024,
  category: 'Sedan',
  transmission: 'Automatic',
  fuelType: 'Gasoline',
  seats: 5,
  pricePerDay: 50,
  location: 'Mohammedia',
  description: 'Comfortable sedan',
  features: ['Air Conditioning', 'Bluetooth'],
  images: ['camry1.jpg'],
  available: true
};

// Mock booking data
export const mockBooking = {
  _id: 'booking123',
  user: mockUser._id,
  car: mockCar,
  startDate: '2025-01-15',
  endDate: '2025-01-20',
  pickupTime: '10:00',
  returnTime: '10:00',
  pickupLocation: {
    branch: 'Mohammedia Office',
    address: 'Derb Chabab A el Alia, Mohammedia 28810'
  },
  dropoffLocation: {
    branch: 'Mohammedia Office',
    address: 'Derb Chabab A el Alia, Mohammedia 28810'
  },
  totalDays: 5,
  totalPrice: 250,
  status: 'pending',
  paymentMethod: 'credit_card',
  extras: []
};

// Mock API responses
export const mockApiResponse = (data, success = true) => ({
  success,
  ...data
});

// Wait for async updates
export const waitFor = (callback, options = {}) => {
  return new Promise((resolve, reject) => {
    const timeout = options.timeout || 1000;
    const interval = options.interval || 50;
    const startTime = Date.now();

    const check = () => {
      try {
        callback();
        resolve();
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          reject(error);
        } else {
          setTimeout(check, interval);
        }
      }
    };

    check();
  });
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
