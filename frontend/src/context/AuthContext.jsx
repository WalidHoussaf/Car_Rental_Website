import React, { useState, useEffect } from 'react';
import { api } from '../config/api.js';

import AuthContext from './authContext';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Clear authentication data
  const clearAuthData = React.useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Refresh access token
  const refreshAccessToken = React.useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        clearAuthData();
        return false;
      }

      const response = await api.auth.refreshToken({ refreshToken });
      
      if (response.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        // Verify the new token to get user data
        const verifyResponse = await api.auth.verifyToken();
        if (verifyResponse.success) {
          setUser(verifyResponse.data.user);
          setIsAuthenticated(true);
          return true;
        }
      }
      
      clearAuthData();
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuthData();
      return false;
    }
  }, [clearAuthData]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (token) {
        try {
          const response = await api.auth.verifyToken();
          if (response.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            // Try to refresh token if verification fails
            if (refreshToken) {
              await refreshAccessToken();
            } else {
              clearAuthData();
            }
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          // Try to refresh token on error
          if (refreshToken) {
            await refreshAccessToken();
          } else {
            clearAuthData();
          }
        }
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, [refreshAccessToken, clearAuthData]);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.auth.login({ email, password });
      
      if (response.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.message || 'Login failed',
          lockTimeRemaining: response.lockTimeRemaining,
          attemptsRemaining: response.attemptsRemaining
        };
      }
    } catch (error) {
      // Check if it's an account lockout error (HTTP 423)
      if (error.response?.status === 423) {
        return {
          success: false,
          message: error.response.data?.message || 'Account is locked',
          lockTimeRemaining: error.response.data?.lockTimeRemaining,
          locked: true
        };
      }
      
      return { 
        success: false, 
        message: error.message || 'Failed to login',
        attemptsRemaining: error.response?.data?.attemptsRemaining
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
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
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
  const logout = async () => {
    try {
      // Call backend to revoke all tokens
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
    }
  };

  // Create value object
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    updateProfile,
    logout,
    refreshAccessToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};