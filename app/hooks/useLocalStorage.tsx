import { useEffect, useState } from "react";

interface LocalStorage<T> {
  value: T;
  set: (newVal: T) => void;
  clear: () => void;
}

/**
 * This custom function/hook safely handles SSR by checking
 * for the window before accessing browser localStorage.
 * IMPORTANT: It has a local react state AND a localStorage state.
 * When initializing the state with a default value,
 * clearing will revert to this default value for the state and
 * the corresponding token gets deleted in the localStorage.
 *
 * @param key - The key from localStorage, generic type T.
 * @param defaultValue - The default value if nothing is in localStorage yet.
 * @returns An object containing:
 *  - value: The current value (synced with localStorage).
 *  - set: Updates both react state & localStorage.
 *  - clear: Resets state to defaultValue and deletes localStorage key.
 */
export default function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): LocalStorage<T> {
  const [value, setValue] = useState<T>(defaultValue);

  // On mount, try to read the stored value
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR safeguard
    try {
      const stored = globalThis.localStorage.getItem(key);
      console.log(`Reading from localStorage (${key}):`, stored);
      
      if (stored) {
        try {
          // For token, we want to avoid parsing
          if (key === "token") {
            console.log(`Setting ${key} directly:`, stored);
            setValue(stored as unknown as T);
          } else {
            // For other values, parse as usual
            setValue(JSON.parse(stored) as T);
          }
        } catch (parseError) {
          console.error(`Error parsing localStorage value for "${key}":`, parseError);
          // If parsing fails, try to use the value directly
          setValue(stored as unknown as T);
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  // Simple setter that updates both state and localStorage
  const set = (newVal: T) => {
    console.log(`Setting ${key} to:`, newVal);
    setValue(newVal);
    
    if (typeof window !== "undefined") {
      try {
        // For token, store directly without JSON.stringify
        if (key === "token" && typeof newVal === "string") {
          console.log(`Storing ${key} directly:`, newVal);
          globalThis.localStorage.setItem(key, newVal);
        } else {
          // For other values, stringify as usual
          globalThis.localStorage.setItem(key, JSON.stringify(newVal));
        }
        
        // Verify storage
        console.log(`Verified ${key} in localStorage:`, globalThis.localStorage.getItem(key));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  };

  // Removes the key from localStorage and resets the state
  const clear = () => {
    setValue(defaultValue);
    if (typeof window !== "undefined") {
      globalThis.localStorage.removeItem(key);
    }
  };

  return { value, set, clear };
}
