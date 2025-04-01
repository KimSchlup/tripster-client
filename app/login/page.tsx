"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
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
  const { set: setToken } = useLocalStorage<string>("token", "");
  const { set: setID } = useLocalStorage<string>("id", "");
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const values: FormFieldProps = { username, password };
      const response = await apiService.post<User>("/auth/login", values);

      if (response.token) {
        setToken(response.token);
      } 
      if (response.id) {
        setID(response.id);
      }

      router.push("/my-roadtrips");
    } catch (error) {
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
      <Header isLoginPage={false} />
      
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
            className="form-button"
            data-clicked="Clicked" 
            data-state="Default" 
          >
            <div className="form-button-text">Login</div>
          </button>
        </form>
        
        <div style={{alignSelf: 'stretch', height: 36, textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>
          <span style={{color: 'black', fontSize: 14, fontFamily: 'Manrope', fontWeight: '700', lineHeight: 24, wordWrap: 'break-word'}}>
            or <Link href="/register" style={{color: '#449BFF', textDecoration: 'none'}}>register</Link>
          </span>
        </div>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '20px', borderTop: '1.5px solid #090909'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px'}}>
          <div style={{color: '#090909', fontSize: 14, fontFamily: 'Manrope', fontWeight: '700', lineHeight: '24px', wordWrap: 'break-word'}}>
            AGB <br/>IMPRESSUM<br/>DATENSCHUTZ
          </div>
          <div style={{color: '#090909', fontSize: 14, fontFamily: 'Manrope', fontWeight: '700', lineHeight: '24px', wordWrap: 'break-word'}}>
            INSTAGRAM<br/>TELEGRAM<br/>NEWSLETTER
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
