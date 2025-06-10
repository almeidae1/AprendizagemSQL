import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, Language } from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';
import { useLanguage } from './LanguageContext'; // To access t function for errors

// Simulate a backend call delay
const apiCallDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user storage (in a real app, this is your backend database)
const MOCK_USERS_DB_KEY = 'sqlPracticeApp_mockUsersDB';
const getMockUsers = (): User[] => {
  const users = localStorage.getItem(MOCK_USERS_DB_KEY);
  return users ? JSON.parse(users) : [];
};
const saveMockUsers = (users: User[]) => {
  localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true to check initial auth state
  const [authError, setAuthError] = useState<string | null>(null);
  const { t } = useLanguage(); // For error messages

  const clearAuthError = () => setAuthError(null);

  const setSession = (user: User) => {
    setCurrentUser(user);
    // Simulate setting a session token
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, JSON.stringify({ userId: user.id, email: user.email, name: user.name }));
  };

  const clearSession = () => {
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  };

  // Check initial auth state (e.g., from a stored token)
  useEffect(() => {
    const checkStoredSession = async () => {
      setIsLoading(true);
      setAuthError(null);
      await apiCallDelay(500); // Simulate checking session
      try {
        const storedToken = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        if (storedToken) {
          const { userId, email, name } = JSON.parse(storedToken);
          // In a real app, you'd validate this token with a backend
          // For mock, we'll assume it's valid if present
          const mockUsers = getMockUsers();
          const existingUser = mockUsers.find(u => u.id === userId && u.email === email);
          if (existingUser) {
            setCurrentUser(existingUser);
          } else {
             clearSession(); // Token is for a non-existent user in mock DB
          }
        }
      } catch (e) {
        console.error("Failed to parse stored auth token", e);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };
    checkStoredSession();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    setAuthError(null);
    await apiCallDelay(1000); // Simulate API call

    const mockUsers = getMockUsers();
    const user = mockUsers.find(u => u.email === email); // In real app, also check hashed password

    if (user) { // Simplified: In real app, backend validates password
      setSession(user);
      setIsLoading(false);
    } else {
      setAuthError(t('authErrorInvalidCredentials'));
      setIsLoading(false);
      throw new Error(t('authErrorInvalidCredentials'));
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setAuthError(null);
    await apiCallDelay(1500); // Simulate Google OAuth flow

    // Simulate Google returning a user profile
    const googleEmail = "googleuser@example.com";
    const googleName = "Google User";
    
    let mockUsers = getMockUsers();
    let user = mockUsers.find(u => u.email === googleEmail);

    if (!user) { // Auto-register Google user if not found (common pattern)
      user = { id: `google_${Date.now()}`, email: googleEmail, name: googleName };
      mockUsers.push(user);
      saveMockUsers(mockUsers);
    }
    
    setSession(user);
    setIsLoading(false);
  };

  const registerWithEmail = async (email: string, pass: string, name?: string) => {
    setIsLoading(true);
    setAuthError(null);
    await apiCallDelay(1000);

    let mockUsers = getMockUsers();
    if (mockUsers.some(u => u.email === email)) {
      setAuthError(t('authErrorEmailExists'));
      setIsLoading(false);
      throw new Error(t('authErrorEmailExists'));
    }

    const newUser: User = {
      id: `user_${Date.now()}`, // Simple unique ID for mock
      email,
      name: name || email.split('@')[0], // Default name from email prefix
    };
    mockUsers.push(newUser);
    saveMockUsers(mockUsers);
    setSession(newUser);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    setAuthError(null);
    await apiCallDelay(500);
    clearSession();
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated: !!currentUser, 
      isLoading, 
      authError, 
      loginWithEmail, 
      loginWithGoogle, 
      registerWithEmail, 
      logout,
      clearAuthError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
