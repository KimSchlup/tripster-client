export interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
  token: string | null;
  expiresAt: number | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  expiresAt?: number; // Optional as the backend might not provide this
}

export interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
  isTokenExpired: () => boolean;
  getAuthHeader: () => { Authorization: string } | Record<string, never>;
}

export enum AuthActionType {
  LOGIN_START = 'LOGIN_START',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  CLEAR_ERROR = 'CLEAR_ERROR',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
}

export type AuthAction =
  | { type: AuthActionType.LOGIN_START }
  | { type: AuthActionType.LOGIN_SUCCESS; payload: { userId: string; token: string; expiresAt: number } }
  | { type: AuthActionType.LOGIN_FAILURE; payload: string }
  | { type: AuthActionType.LOGOUT }
  | { type: AuthActionType.CLEAR_ERROR }
  | { type: AuthActionType.SESSION_EXPIRED };
