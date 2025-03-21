"use client";

import Image from 'next/image';
import myImg from '../../../public/zine.png';
import { useState } from 'react';
import decryptAuthURL from '../../../helpers/decrypt';
import GoogleLoginButton from '../../components/GoogleLoginButton';

export default function LoginPage() {
    // State variables for form inputs
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Error message state


    // Handle form submission from Login Button
    const handleLogin = async (e) => {
      e.preventDefault(); // Prevent default form submission behavior
    
      if (!identifier || !password) {
        setErrorMessage("Please enter both email/username and password.");
        return;
      }
    
      const payload = {
        email: identifier,
        password: password,
      };
    
      try {
        const response = await fetch("http://localhost:8080/consumer/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

          },
          body: JSON.stringify(payload),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.message || "Login failed.");
          return;
        }
    
        const data = await response.json();
        // Store tokens and redirect or update UI as needed
        console.log(data);
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);
        localStorage.setItem("expires_at", data.expires_at);
        console.log(localStorage.getItem("accessToken"));
        window.location.href = "/home"; // Redirect upon success
      } catch (error) {
        console.error("Error during login:", error);
        setErrorMessage("An error occurred. Please try again.");
      }
    };
    
    const handleGoogleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch("http://localhost:8080/auth/google", {
          method: "GET",
          headers: {
            "Accept": "application/json"
          },
          //credentials: "include"
        });

        if (!response.ok) {
          throw new Error("Failed to initiate Google authentication");
        }

        const data = await response.json();
        // Redirect to Google's consent page
        if (data.auth_url) {
          const encryptionKey = "1sGJ7CIrKwdSRPVtC4rzJ0rO8pkGjfaX";
          const url = await decryptAuthURL(data.auth_url, encryptionKey);
          console.log("Decrypted URL:", url);
          console.log("Redirecting to Google login page:", url);
          url 
          window.location.href = url;
        } else {
          throw new Error("Invalid authentication URL");
        }
      } catch (error) {
        console.error("Google login error:", error);
        setErrorMessage("Failed to initiate Google login");
      }
    };
    
    
    

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        {/* Main Login Card */}
        <div className="w-full max-w-xs bg-white border border-gray-300 rounded-lg p-8">
          {/* Zine Logo */}
          <div className="flex justify-center mb-6">
            <Image src={myImg}  width={70} height={70} alt="Zine" />
          </div>
          <form>
            <input
              data-testid="email-input"
              type="text"
              placeholder="Email"
              className="mb-3 w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <input
              data-testid="password-input"
              type="password"
              placeholder="Password"
              className="mb-3 w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage && (
              <div data-testid="error-message" className=" mb-4 flex items-center justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                <span>{errorMessage}</span>
                <button
                  onClick={() => setErrorMessage('')}
                  className="ml-4 font-bold focus:outline-none"
                >
                  X
                </button>
              </div>
            )}

            <button
              type="button"
              data-testid="login-button"
              className="w-full bg-blue-500 text-white py-2 rounded font-semibold text-sm hover:bg-blue-600 transition"
              onClick={handleLogin} // Call handleLogin function on click
            >
              Log In
            </button>
            <div className="text-center text-sm text-gray-500 my-4">OR</div>
            <div className="text-center">
            <GoogleLoginButton setErrorMessage={setErrorMessage} />
            
          </div>
          

          </form>
          <div className="mt-6 text-center">
            <a data-testid="forgot-password-link" href="/Forgot" className="text-sm text-blue-600 font-semibold">
              Forgot password?
            </a>
          </div>
        </div>
        {/* Sign Up Card */}
        <div className="w-full max-w-xs bg-white border border-gray-300 rounded-lg p-4 text-center text-sm">
          <span className="text-gray-700">Don&apos;t have an account?</span>{' '}
          <a href="#" className="text-blue-600 font-semibold">
            Sign up
          </a>
        </div>

      </div>
    );
  }
  