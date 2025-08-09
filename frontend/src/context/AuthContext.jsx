import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../config/api.js';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verify token with backend
          const response = await api.auth.verifyToken();
          if (response.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.auth.login({ email, password });
      
      if (response.success) {
        // Save token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Update state
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.message || 'Login failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to login' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.auth.register(userData);
      
      if (response.success) {
        // Save token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Update state
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.message || 'Registration failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to register' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await api.auth.updateProfile(profileData);
      
      if (response.success) {
        // Update user data in localStorage and state
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.message || 'Profile update failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to update profile' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
  };

  // Create value object
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    updateProfile,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;