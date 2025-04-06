"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { useState } from "react";
import Header from "@/components/Header";

interface RegisterFormProps {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const { set: setToken } = useLocalStorage<string>("token", "");
  const { set: setID } = useLocalStorage<string>("id", "");
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if passwords match
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const registerData: RegisterFormProps = {
        firstName,
        lastName,
        username,
        email,
        password
      };

      // Call the API service
      const response = await apiService.post<User>("/users", registerData);

      // Store token and ID if available
      if (response.token) {
        setToken(response.token);
      }
      if (response.id) {
        setID(response.id);
      }

      // Navigate to the user overview
      router.push("/my-roadtrips");
    } catch (error) {
      if (error instanceof Error) {
        alert(`Something went wrong during registration:\n${error.message}`);
      } else {
        console.error("An unknown error occurred during registration.");
      }
    }
  };

  return (
    <div style={{width: '100%', minHeight: '100vh', position: 'relative', background: 'white', overflow: 'hidden'}}>
      {/* Header */}
      <Header isLoginPage={false} />
      
      {/* Main Content */}
      <div style={{paddingTop: '100px', paddingBottom: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        {/* Registration Form */}
        <div style={{width: 345, display: 'flex', flexDirection: 'column', gap: 12}}>
        <form onSubmit={handleRegister} style={{width: '100%'}}>
          {/* First Name */}
          <div className="form-input-container" data-clicked={firstName ? "Clicked" : "Default"} data-state="Default">
            {!firstName && (
              <div className="form-input-placeholder">
                <div>Prename</div>
              </div>
            )}
            <input 
              type="text" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          {/* Last Name */}
          <div className="form-input-container" data-clicked={lastName ? "Clicked" : "Default"} data-state="Default">
            {!lastName && (
              <div className="form-input-placeholder">
                <div>Name</div>
              </div>
            )}
            <input 
              type="text" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          {/* Username */}
          <div className="form-input-container" data-clicked={username ? "Clicked" : "Default"} data-state="Default">
            {!username && (
              <div className="form-input-placeholder">
                <div>Username</div>
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
          
          {/* Email */}
          <div className="form-input-container" data-clicked={email ? "Clicked" : "Default"} data-state="Default">
            {!email && (
              <div className="form-input-placeholder">
                <div>Email</div>
              </div>
            )}
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          {/* Password */}
          <div className="form-input-container" data-clicked={password ? "Clicked" : "Default"} data-state="Default">
            {!password && (
              <div className="form-input-placeholder">
                <div>Password</div>
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
          
          {/* Confirm Password */}
          <div className="form-input-container" data-clicked={confirmPassword ? "Clicked" : "Default"} data-state="Default">
            {!confirmPassword && (
              <div className="form-input-placeholder">
                <div>Confirm password</div>
              </div>
            )}
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          {/* Register Button */}
          <div style={{display: 'flex', justifyContent: 'center', marginTop: '12px'}}>
            <button 
              type="submit"
              className="form-button"
              data-clicked="Clicked" 
              data-state="Default" 
            >
              <div className="form-button-text">Register</div>
            </button>
          </div>
        </form>
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

export default Register;
