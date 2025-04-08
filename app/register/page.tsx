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
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [lastName, setLastName] = useState("");
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [username, setUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

  // Email validation regex
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let isValid = true;
      
      // Check if firstName is not empty
      if (!firstName.trim()) {
        setIsFirstNameValid(false);
        isValid = false;
      }

      // Check if lastName is not empty
      if (!lastName.trim()) {
        setIsLastNameValid(false);
        isValid = false;
      }

      // Check if username is not empty
      if (!username.trim()) {
        setIsUsernameValid(false);
        isValid = false;
      }

      // Check if email is valid
      if (!email.trim()) {
        setIsEmailValid(false);
        isValid = false;
      } else if (!validateEmail(email)) {
        setIsEmailValid(false);
        isValid = false;
      }

      // Check if password is not empty
      if (!password.trim()) {
        setIsPasswordValid(false);
        isValid = false;
      }

      // Check if confirm password is not empty
      if (!confirmPassword.trim()) {
        setIsConfirmPasswordValid(false);
        isValid = false;
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        isValid = false;
      }

      if (!isValid) {
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
      if (response.userId) {
        setID(response.userId);
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
          <div className="form-input-container" data-clicked={firstName ? "Clicked" : "Default"} data-state={isFirstNameValid ? "Default" : "Error"}>
            {!firstName && (
              <div className="form-input-placeholder">
                <div>Prename</div>
              </div>
            )}
            <input 
              type="text" 
              value={firstName}
              onChange={(e) => {
                const newFirstName = e.target.value;
                setFirstName(newFirstName);
                // Reset validation when user types
                setIsFirstNameValid(true);
              }}
              onBlur={() => {
                // Validate on blur
                setIsFirstNameValid(!!firstName.trim());
              }}
              required
              className="form-input"
            />
            {!isFirstNameValid && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                First name cannot be empty
              </div>
            )}
          </div>
          
          {/* Last Name */}
          <div className="form-input-container" data-clicked={lastName ? "Clicked" : "Default"} data-state={isLastNameValid ? "Default" : "Error"}>
            {!lastName && (
              <div className="form-input-placeholder">
                <div>Name</div>
              </div>
            )}
            <input 
              type="text" 
              value={lastName}
              onChange={(e) => {
                const newLastName = e.target.value;
                setLastName(newLastName);
                // Reset validation when user types
                setIsLastNameValid(true);
              }}
              onBlur={() => {
                // Validate on blur
                setIsLastNameValid(!!lastName.trim());
              }}
              required
              className="form-input"
            />
            {!isLastNameValid && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                Last name cannot be empty
              </div>
            )}
          </div>
          
          {/* Username */}
          <div className="form-input-container" data-clicked={username ? "Clicked" : "Default"} data-state={isUsernameValid ? "Default" : "Error"}>
            {!username && (
              <div className="form-input-placeholder">
                <div>Username</div>
              </div>
            )}
            <input 
              type="text" 
              value={username}
              onChange={(e) => {
                const newUsername = e.target.value;
                setUsername(newUsername);
                // Reset validation when user types
                setIsUsernameValid(true);
              }}
              onBlur={() => {
                // Validate on blur
                setIsUsernameValid(!!username.trim());
              }}
              required
              className="form-input"
            />
            {!isUsernameValid && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                Username cannot be empty
              </div>
            )}
          </div>
          
          {/* Email */}
          <div className="form-input-container" data-clicked={email ? "Clicked" : "Default"} data-state={isEmailValid ? "Default" : "Error"}>
            {!email && (
              <div className="form-input-placeholder">
                <div>Email</div>
              </div>
            )}
            <input 
              type="email" 
              value={email}
              onChange={(e) => {
                const newEmail = e.target.value;
                setEmail(newEmail);
                // Only validate if there's content
                if (newEmail) {
                  setIsEmailValid(validateEmail(newEmail));
                } else {
                  setIsEmailValid(true); // Reset validation when empty
                }
              }}
              required
              className="form-input"
            />
            {!isEmailValid && email && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                Please enter a valid email address
              </div>
            )}
          </div>
          
          {/* Password */}
          <div className="form-input-container" data-clicked={password ? "Clicked" : "Default"} data-state={isPasswordValid ? "Default" : "Error"}>
            {!password && (
              <div className="form-input-placeholder">
                <div>Password</div>
              </div>
            )}
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                const newPassword = e.target.value;
                setPassword(newPassword);
                // Reset validation when user types
                setIsPasswordValid(true);
              }}
              onBlur={() => {
                // Validate on blur
                setIsPasswordValid(!!password.trim());
              }}
              required
              className="form-input"
            />
            {!isPasswordValid && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                Password cannot be empty
              </div>
            )}
          </div>
          
          {/* Confirm Password */}
          <div className="form-input-container" data-clicked={confirmPassword ? "Clicked" : "Default"} data-state={isConfirmPasswordValid ? "Default" : "Error"}>
            {!confirmPassword && (
              <div className="form-input-placeholder">
                <div>Confirm password</div>
              </div>
            )}
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => {
                const newConfirmPassword = e.target.value;
                setConfirmPassword(newConfirmPassword);
                // Reset validation when user types
                setIsConfirmPasswordValid(true);
              }}
              onBlur={() => {
                // Validate on blur
                setIsConfirmPasswordValid(!!confirmPassword.trim());
              }}
              required
              className="form-input"
            />
            {!isConfirmPasswordValid && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                Confirm password cannot be empty
              </div>
            )}
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
    </div>
  );
};

export default Register;
