import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // In a real app, we would verify the token with your backend
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email) => {
    try {
      // This is where you would make an API call to authenticate
      // For now, we'll simulate a successful login
      
      // Sample user data (in a real app, this would come from your API)
      const userData = {
        id: '1',
        name: 'Walid Yugen',
        email: email,
      };
      
      // Save to localStorage (in a real app, you'd store the JWT token)
      localStorage.setItem('token', 'sample-jwt-token');
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to login' 
      };
    }
  };

  // Register function
  const register = async (name, email) => {
    try {
      // This is where you would make an API call to register the user
      // For now, we'll simulate a successful registration
      
      // Sample user data (in a real app, this would come from your API)
      const userData = {
        id: '1',
        name: name,
        email: email,
      };
      
      // Save to localStorage (in a real app, you'd store the JWT token)
      localStorage.setItem('token', 'sample-jwt-token');
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to register' 
      };
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
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;