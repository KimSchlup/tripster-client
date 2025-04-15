"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

interface FormFieldProps {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const { login } = useAuth();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const values: FormFieldProps = { username, password };
      console.log("Login attempt with:", username);
      
      // Clear any existing token before login
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      
      const response = await apiService.post<User>("/auth/login", values);
      console.log("Login response:", response);

      if (response.token && response.userId) {
        console.log("Received token:", response.token);
        console.log("Received userId:", response.userId);
        
        // Store token directly in localStorage for debugging
        localStorage.setItem("token", response.token);
        console.log("Token stored directly:", localStorage.getItem("token"));
        
        // Then use the login function
        login(response.token, response.userId);
        
        // Verify token was stored
        console.log("Token after login:", localStorage.getItem("token"));
        
        // Add a small delay before navigation to ensure token is stored
        setTimeout(() => {
          // Navigate to roadtrips page
          router.push("/my-roadtrips");
        }, 500);
      } else {
        throw new Error("Invalid response from server: missing token or userId");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        alert(`Something went wrong during the login:\n${error.message}`);
      } else {
        console.error("An unknown error occurred during login.");
      }
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
          <div className="form-input-container" data-clicked={username ? "Clicked" : "Default"} data-state="Default">
            {!username && (
              <div className="form-input-placeholder">
                <div>username</div>
              </div>
            )}
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
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
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <button 
            type="submit"
            style={{
              zIndex: 9999,
              pointerEvents: "auto",
              position: "relative",
              width: "100%",
              padding: "10px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Login
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
