"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { LoginCredentials } from "@/types/auth";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/useToast";
import { validatePassword, PasswordStrength, doPasswordsMatch } from "@/utils/passwordUtils";

const Register: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const { login, authState, clearError } = useAuth();
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [lastName, setLastName] = useState("");
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [username, setUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(PasswordStrength.WEAK);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Clear any previous auth errors when component mounts
  useEffect(() => {
    if (authState.error) {
      clearError();
    }
  }, [authState.error, clearError]);

  // Email validation regex
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Check password strength when password changes
  useEffect(() => {
    if (password) {
      const result = validatePassword(password);
      setPasswordStrength(result.strength);
      setPasswordMessage(result.message);
    } else {
      setPasswordStrength(PasswordStrength.WEAK);
      setPasswordMessage("");
    }
  }, [password]);

  // Get color based on password strength
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case PasswordStrength.STRONG:
        return "#4CAF50"; // Green
      case PasswordStrength.MEDIUM:
        return "#FF9800"; // Orange
      case PasswordStrength.WEAK:
      default:
        return "#F44336"; // Red
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setFormError(null);
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

      // Check password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setFormError(passwordValidation.message);
        isValid = false;
      }

      // Check if passwords match
      if (!doPasswordsMatch(password, confirmPassword)) {
        setIsConfirmPasswordValid(false);
        setFormError("Passwords do not match");
        isValid = false;
      }

      if (!isValid) {
        showToast("Please fix the errors in the form", "error");
        return;
      }

      const registerData = {
        firstName,
        lastName,
        username,
        mail: email,
        password
      };

      // Call the API service
      await apiService.post("/users", registerData);
      showToast("Registration successful!", "success");

      // Login with the new credentials
      const loginData: LoginCredentials = { username, password };
      await login(loginData);

      // Navigate to the user overview
      router.push("/my-roadtrips");
    } catch (error) {
      console.error("Registration error:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unknown error occurred during registration";
      
      setFormError(errorMessage);
      showToast(errorMessage, "error");
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
        {/* Registration Form */}
        <div style={{width: 345, display: 'flex', flexDirection: 'column', gap: 12}}>
        <form onSubmit={handleRegister} style={{width: '100%'}}>
          {/* Form Error */}
          {formError && (
            <div style={{
              padding: '10px',
              marginBottom: '15px',
              backgroundColor: '#ffebee',
              color: '#d32f2f',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {formError}
            </div>
          )}
          
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
                if (formError) setFormError(null);
              }}
              onBlur={() => {
                // Validate on blur
                setIsFirstNameValid(!!firstName.trim());
              }}
              required
              className="form-input"
              disabled={isSubmitting}
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
                if (formError) setFormError(null);
              }}
              onBlur={() => {
                // Validate on blur
                setIsLastNameValid(!!lastName.trim());
              }}
              required
              className="form-input"
              disabled={isSubmitting}
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
                if (formError) setFormError(null);
              }}
              onBlur={() => {
                // Validate on blur
                const isEmpty = !username.trim();
                setIsUsernameValid(!isEmpty);
              }}
              required
              className="form-input"
              disabled={isSubmitting}
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
                if (formError) setFormError(null);
              }}
              required
              className="form-input"
              disabled={isSubmitting}
            />
            {!isEmailValid && email && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                Please enter a valid email address
              </div>
            )}
          </div>
          
          {/* Password */}
          <div className="form-input-container" data-clicked={password ? "Clicked" : "Default"} data-state={password && passwordStrength === PasswordStrength.WEAK ? "Error" : "Default"}>
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
                if (formError) setFormError(null);
              }}
              required
              className="form-input"
              disabled={isSubmitting}
            />
            {password && (
              <div style={{ 
                fontSize: '12px', 
                marginTop: '4px',
                color: getPasswordStrengthColor()
              }}>
                {passwordMessage}
                <div style={{
                  height: '4px',
                  backgroundColor: getPasswordStrengthColor(),
                  width: passwordStrength === PasswordStrength.STRONG ? '100%' : 
                         passwordStrength === PasswordStrength.MEDIUM ? '66%' : '33%',
                  marginTop: '4px',
                  borderRadius: '2px'
                }} />
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
                if (formError) setFormError(null);
              }}
              onBlur={() => {
                // Validate on blur
                if (password && confirmPassword) {
                  setIsConfirmPasswordValid(doPasswordsMatch(password, confirmPassword));
                }
              }}
              required
              className="form-input"
              disabled={isSubmitting}
            />
            {!isConfirmPasswordValid && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                Passwords do not match
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
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'default' : 'pointer'
              }}
            >
              <div className="form-button-text">{isSubmitting ? "Registering..." : "Register"}</div>
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
