"use client";

import { useEffect, createContext, useContext, ReactNode, useReducer, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "./useApi";
import { useToast } from "./useToast";
import {
  AuthState,
  AuthContextType,
  AuthAction,
  AuthActionType,
  LoginCredentials,
  LoginResponse
} from "@/types/auth";
import {
  calculateTokenExpiration,
  isTokenExpired,
  storeToken,
  retrieveToken
} from "@/utils/tokenUtils";
import {
  setupActivityTracking,
  hasSessionTimedOut,
  clearSession
} from "@/utils/sessionUtils";

// Initial authentication state
const initialAuthState: AuthState = {
  isLoggedIn: false,
  userId: null,
  token: null,
  expiresAt: null,
  isLoading: true,
  error: null
};

// Auth state reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionType.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case AuthActionType.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        userId: action.payload.userId,
        token: action.payload.token,
        expiresAt: action.payload.expiresAt,
        isLoading: false,
        error: null
      };
    case AuthActionType.LOGIN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        userId: null,
        token: null,
        expiresAt: null,
        isLoading: false,
        error: action.payload
      };
    case AuthActionType.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        userId: null,
        token: null,
        expiresAt: null,
        isLoading: false,
        error: null
      };
    case AuthActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case AuthActionType.SESSION_EXPIRED:
      return {
        ...state,
        isLoggedIn: false,
        userId: null,
        token: null,
        expiresAt: null,
        isLoading: false,
        error: "Session expired. Please log in again."
      };
    default:
      return state;
  }
};

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session check interval in milliseconds (1 minute)
const SESSION_CHECK_INTERVAL = 60 * 1000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);
  const router = useRouter();
  const apiService = useApi();
  const { showToast } = useToast();

  // Check if token is expired
  const isTokenExpiredCheck = useCallback(() => {
    return isTokenExpired(authState.expiresAt);
  }, [authState.expiresAt]);

  // Get auth header for API requests
  const getAuthHeader = useCallback((): { Authorization: string } | Record<string, never> => {
    return authState.token ? { Authorization: authState.token } : {};
  }, [authState.token]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: AuthActionType.CLEAR_ERROR });
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: AuthActionType.LOGIN_START });

      // Call login API
      const response = await apiService.post<LoginResponse>("/auth/login", credentials);

      if (!response.token || !response.userId) {
        throw new Error("Invalid response from server: missing token or userId");
      }

      // Calculate token expiration
      const expiresAt = calculateTokenExpiration(response.token);

      // Store token securely
      storeToken("token", response.token);
      storeToken("userId", response.userId);
      storeToken("expiresAt", expiresAt.toString());

      // Update auth state
      dispatch({
        type: AuthActionType.LOGIN_SUCCESS,
        payload: {
          userId: response.userId,
          token: response.token,
          expiresAt
        }
      });

      // Show success toast
      showToast("Login successful", "success");

      // Setup activity tracking
      setupActivityTracking();

      return response;
    } catch (error) {
      console.error("Login error:", error);
      
      // Handle error
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unknown error occurred during login";
      
      dispatch({
        type: AuthActionType.LOGIN_FAILURE,
        payload: errorMessage
      });

      // Show error toast
      showToast(errorMessage, "error");
      
      throw error;
    }
  }, [apiService, showToast]);

  // Logout function
  const logout = useCallback(async () => {
    // Note: The actual navigation is now handled in SidebarMenu.tsx
    // to ensure it happens before the auth state changes
    
    try {
      // Get the current token before we clear it
      const currentToken = authState.token;
      
      if (currentToken) {
        // Send POST request to logout endpoint with the token explicitly in headers
        try {
          await apiService.post('/auth/logout', {}, {
            headers: {
              'Authorization': currentToken
            }
          });
          console.log('Logout request sent with token in headers:', currentToken);
        } catch (error) {
          console.error('Logout API call failed:', error);
          // Continue with logout process even if API call fails
        }
      }
    } finally {
      // Clear authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("expiresAt");
      
      // Clear session data
      clearSession();
      
      // Update auth state
      dispatch({ type: AuthActionType.LOGOUT });
      
      // Show toast
      showToast("You have been logged out", "info");
    }
  }, [apiService, authState.token, showToast]);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = retrieveToken("token");
        const userId = retrieveToken("userId");
        const expiresAtStr = retrieveToken("expiresAt");
        const expiresAt = expiresAtStr ? parseInt(expiresAtStr, 10) : null;
        
        if (token && userId && expiresAt) {
          // Check if token is expired
          if (isTokenExpired(expiresAt)) {
            // Token expired, clear data and show message
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("expiresAt");
            dispatch({ type: AuthActionType.SESSION_EXPIRED });
            showToast("Your session has expired. Please log in again.", "warning");
          } else {
            // Valid token, restore auth state
            dispatch({
              type: AuthActionType.LOGIN_SUCCESS,
              payload: {
                userId,
                token,
                expiresAt
              }
            });
            
            // Setup activity tracking
            setupActivityTracking();
          }
        } else {
          // No token found, set not loading
          dispatch({ type: AuthActionType.LOGOUT });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        dispatch({ type: AuthActionType.LOGOUT });
      }
    };
    
    initializeAuth();
  }, [showToast]);

  // Set up periodic session checks
  useEffect(() => {
    if (!authState.isLoggedIn) return;
    
    const checkSession = () => {
      // Check if token is expired
      if (isTokenExpiredCheck()) {
        dispatch({ type: AuthActionType.SESSION_EXPIRED });
        showToast("Your session has expired. Please log in again.", "warning");
        router.push('/login');
        return;
      }
      
      // Check for inactivity timeout
      if (hasSessionTimedOut()) {
        dispatch({ type: AuthActionType.SESSION_EXPIRED });
        showToast("Your session has timed out due to inactivity.", "warning");
        router.push('/login');
        return;
      }
    };
    
    // Initial check
    checkSession();
    
    // Set up interval for periodic checks
    const intervalId = setInterval(checkSession, SESSION_CHECK_INTERVAL);
    
    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, [authState.isLoggedIn, isTokenExpiredCheck, router, showToast]);

  // Context value
  const contextValue: AuthContextType = {
    authState,
    login,
    logout,
    clearError,
    isTokenExpired: isTokenExpiredCheck,
    getAuthHeader
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
