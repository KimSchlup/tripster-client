"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginCredentials } from "@/types/auth";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useToast } from "@/hooks/useToast";

const Login: React.FC = () => {
  const router = useRouter();
  const { authState, login, clearError } = useAuth();
  const { showToast } = useToast();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear any previous auth errors when component mounts or when inputs change
  useState(() => {
    if (authState.error) {
      clearError();
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Validate inputs
      if (!username.trim()) {
        showToast("Username is required", "error");
        return;
      }
      
      if (!password.trim()) {
        showToast("Password is required", "error");
        return;
      }
      
      const credentials: LoginCredentials = { username, password };
      
      // Call login from auth context
      await login(credentials);
      
      // Navigate to roadtrips page on success
      router.push("/my-roadtrips");
    } catch (error) {
      console.error("Login error:", error);
      // Error handling is done in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{width: '100%', minHeight: '100vh', position: 'relative', background: 'white', overflow: 'hidden'}}>
      {/* Header */}
      <Header isLoginPage={true} />
      
      {/* Main Content */}
      <div style={{paddingTop: '100px', paddingBottom: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        {/* Login Form */}
        <div style={{width: 346, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 13, display: 'inline-flex'}}>
        <form onSubmit={handleLogin} style={{width: '100%'}}>
          {/* Display auth error if present */}
          {authState.error && (
            <div style={{
              padding: '10px',
              marginBottom: '15px',
              backgroundColor: '#ffebee',
              color: '#d32f2f',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {authState.error}
            </div>
          )}
          
          <div className="form-input-container" data-clicked={username ? "Clicked" : "Default"} data-state="Default">
            {!username && (
              <div className="form-input-placeholder">
                <div>username</div>
              </div>
            )}
            <input 
              type="text" 
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (authState.error) clearError();
              }}
              required
              className="form-input"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-input-container" data-clicked={password ? "Clicked" : "Default"} data-state="Default">
            {!password && (
              <div className="form-input-placeholder">
                <div>password</div>
              </div>
            )}
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (authState.error) clearError();
              }}
              required
              className="form-input"
              disabled={isSubmitting}
            />
          </div>
          
          <button 
            type="submit"
            disabled={isSubmitting}
            style={{
              zIndex: 9999,
              pointerEvents: isSubmitting ? "none" : "auto",
              position: "relative",
              width: "100%",
              padding: "10px",
              backgroundColor: isSubmitting ? "#cccccc" : "black",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: isSubmitting ? "default" : "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div style={{alignSelf: 'stretch', height: 36, textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>
          <span style={{color: 'black', fontSize: 14, fontFamily: 'Manrope', fontWeight: '700', lineHeight: 24, wordWrap: 'break-word'}}>
            or <Link href="/register" style={{color: '#449BFF', textDecoration: 'none'}}>register</Link>
          </span>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
