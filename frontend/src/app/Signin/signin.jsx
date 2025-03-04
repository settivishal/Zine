"use client";

import Image from "next/image";
import myImg from "../zine.png";
import { useState } from "react";

import GoogleLoginButton from '../../../components/googleLoginButton';

export default function SignIn() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // Error message state

    // Handle form submission from Sign up Button
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
      
        if (!email || !password) {
            setErrorMessage("Please enter both email/username and password.");
            return;
        }
      
        const payload = {
            email: email,
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
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            window.location.href = "/home"; // Redirect upon success
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage("An error occurred. Please try again.");
        }
    };
    return (
        <div className="bg-gray-50 flex flex-col items-center justify-center space-y-4">
            {/* Main Login Card */}
            <div className="w-full max-w-s bg-white border border-gray-300 rounded-lg p-8">
                {/* Zine Logo */}
                <div className="flex justify-center mb-6">
                    <Image src={myImg} width={70} height={70} alt="Zine" />
                </div>
                <form>
                    <input
                        type="text"
                        placeholder="Email"
                        className="mb-3 w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="mb-3 w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errorMessage && (
                        <div className="mb-4 text-red-600 text-sm">
                            {errorMessage}
                        </div>
                    )}
                    <button
                        type="button"
                        className="w-full bg-blue-500 text-white py-2 rounded font-semibold text-sm hover:bg-blue-600 transition"
                        onClick={handleLogin} // Call handleLogin function on click
                    >
                        Log in
                    </button>
                    <div className="text-center text-sm text-gray-500 my-4">
                        OR
                    </div>
                    <div className="text-center">
                        <GoogleLoginButton setErrorMessage={setErrorMessage} />
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <a href="#" className="text-sm text-blue-600 font-semibold">
                        Forgot password?
                    </a>
                </div>
            </div>
        </div>
    );
}
