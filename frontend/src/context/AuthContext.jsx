import React, { useState, useEffect } from 'react';
import { api, clearCsrfToken } from '../config/api.js';

import AuthContext from './authContext';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Clear authentication data 
  const clearAuthData = React.useCallback(() => {
    // Only clear user data from localStorage (tokens are in httpOnly cookies)
    localStorage.removeItem('user');
    clearCsrfToken(); // Clear CSRF token cache
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Refresh access token 
  const refreshAccessToken = React.useCallback(async () => {
    try {
      // No need to pass refreshToken - it's in httpOnly cookie
      const response = await api.auth.refreshToken({});
      
      if (response.success) {
        
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
      try {
        // Try to verify token (will use cookie automatically)
        const response = await api.auth.verifyToken();
        if (response.success) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Silently fail if no token exists (user not logged in)
        // Only log if it's not a 401 error (which is expected for logged out users)
        if (!error.message?.includes('Access token is required')) {
          console.error('Token verification failed:', error);
        }
        clearAuthData();
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
        // Tokens are now in httpOnly cookies
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
        // Tokens are now in httpOnly cookies
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