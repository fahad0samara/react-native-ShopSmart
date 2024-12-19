import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isLoading: boolean;
  userToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored token when app loads
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      const isFirstTime = await AsyncStorage.getItem('@first_time');
      
      if (!isFirstTime) {
        // If it's the first time, don't auto-login
        await AsyncStorage.setItem('@first_time', 'false');
        setUserToken(null);
      } else {
        setUserToken(token);
      }
    } catch (error) {
      console.error('Error checking token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For testing, accept any email/password
      const token = 'user_token_' + Date.now();
      await AsyncStorage.setItem('@auth_token', token);
      await AsyncStorage.setItem('@user_email', email);
      setUserToken(token);
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful registration and auto-login
      const token = 'user_token_' + Date.now();
      await AsyncStorage.setItem('@auth_token', token);
      await AsyncStorage.setItem('@user_email', email);
      await AsyncStorage.setItem('@user_name', name);
      setUserToken(token);
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('@auth_token');
      await AsyncStorage.removeItem('@user_email');
      await AsyncStorage.removeItem('@user_name');
      setUserToken(null);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoading, userToken, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
