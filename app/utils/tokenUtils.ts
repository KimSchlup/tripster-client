/**
 * Utility functions for token management
 */

/**
 * Checks if a token is expired based on expiration timestamp
 * @param expiresAt - Expiration timestamp in milliseconds
 * @returns boolean indicating if token is expired
 */
export const isTokenExpired = (expiresAt: number | null): boolean => {
  if (!expiresAt) return true;
  return Date.now() > expiresAt;
};

/**
 * Calculates token expiration time
 * If the token is a JWT, it attempts to decode and extract the expiration
 * Otherwise, it sets a default expiration time (1 hour)
 * @param token - The authentication token
 * @returns Expiration timestamp in milliseconds
 */
export const calculateTokenExpiration = (token: string | null): number => {
  if (!token) return 0;
  
  try {
    // Try to decode JWT to get expiration
    const payload = parseJwt(token);
    if (payload && payload.exp) {
      // JWT exp is in seconds, convert to milliseconds
      return payload.exp * 1000;
    }
  } catch (error) {
    console.error('Error parsing token:', error);
  }
  
  // Default expiration: 1 hour from now
  return Date.now() + 60 * 60 * 1000;
};

/**
 * Interface for JWT payload
 */
interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

/**
 * Parse JWT token to extract payload
 * @param token - JWT token string
 * @returns Decoded payload object
 */
export const parseJwt = (token: string): JwtPayload | null => {
  try {
    // Split the token and get the payload part (second part)
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    // Replace characters and decode
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

/**
 * Safely stores a token in localStorage with obfuscation
 * @param key - localStorage key
 * @param token - Token to store
 */
export const storeToken = (key: string, token: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Simple obfuscation (not true encryption, but better than plaintext)
    const obfuscatedToken = btoa(token);
    localStorage.setItem(key, obfuscatedToken);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

/**
 * Retrieves and deobfuscates a token from localStorage
 * @param key - localStorage key
 * @returns The deobfuscated token or null if not found
 */
export const retrieveToken = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const obfuscatedToken = localStorage.getItem(key);
    if (!obfuscatedToken) return null;
    
    // Deobfuscate the token
    return atob(obfuscatedToken);
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};
