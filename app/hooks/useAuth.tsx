"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import useLocalStorage from "./useLocalStorage";
import { useApi } from "./useApi";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string;
  login: (token: string, userId: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { value: token, set: setToken, clear: clearToken } = useLocalStorage<string>("token", "");
  const { value: userId, set: setUserId, clear: clearUserId } = useLocalStorage<string>("userId", "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const apiService = useApi();

  // Check if user is logged in based on token presence
  useEffect(() => {
    // Check if token exists and is not empty
    console.log("Token in useAuth:", token);
    setIsLoggedIn(!!token && token !== "");
  }, [token]);

  // Login function - store token as is
  const login = (newToken: string, newUserId: string) => {
    console.log("Storing token:", newToken);
    // Store the token exactly as received from the backend
    setToken(newToken);
    setUserId(newUserId);
    setIsLoggedIn(true);
  };

  // Logout function - makes API request to logout endpoint
  const logout = async () => {
    try {
      // Get the current token before we clear it
      const currentToken = token;
      
      if (currentToken) {
        // Send POST request to logout endpoint with the token explicitly in headers
        await apiService.post('/auth/logout', {}, {
          headers: {
            'Authorization': currentToken
          }
        });
        console.log('Logout request sent with token in headers:', currentToken);
      } else {
        console.warn('No token available for logout request');
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with logout process even if API call fails
    } finally {
      // Clear authentication data after the request is complete
      clearToken();
      clearUserId();
      setIsLoggedIn(false);
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
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
