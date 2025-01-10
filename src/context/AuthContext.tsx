import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  isLoading: boolean;
  userToken: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Check for stored auth state when app loads
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Check if we have a stored user
        const storedUser = await AsyncStorage.getItem('@user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log('Restored user from storage:', parsedUser.email);
        }
      } catch (error) {
        console.error('Error restoring auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Store user data in AsyncStorage
          await AsyncStorage.setItem('@user', JSON.stringify(user));
          setUser(user);
          console.log('Auth state updated - User logged in:', user.email);
        } else {
          // Clear stored data
          await AsyncStorage.removeItem('@user');
          setUser(null);
          console.log('Auth state updated - User logged out');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem('@user', JSON.stringify(userCredential.user));
      setUser(userCredential.user);
      console.log('Login successful for user:', email);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await AsyncStorage.setItem('@user', JSON.stringify(userCredential.user));
      setUser(userCredential.user);
      console.log('Registration successful for user:', email);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('@user');
      setUser(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoading, 
      userToken: user ? 'token' : null, // Simplified token handling
      user, 
      login, 
      logout, 
      register 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
