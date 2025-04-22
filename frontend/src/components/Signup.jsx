"use client";
// import { useRouter } from 'next/router';
// import axiosInstance from "../../../helpers/axiosInstance";
import Image from "next/image";
import myImg from "../../public/zine.png";
import GoogleLoginButton from './GoogleLoginButton_new';



import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SignUp({ onTabChange }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState(""); // Error message state
    const [successMessage, setSuccessMessage] = useState(""); // Add success message state

    // Email validation regex
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    // Handle form submission from Login Button
    const handleRegister = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        setErrorMessage("");
        setSuccessMessage(""); // Clear any existing success message

        if (!username || !email || !password) {
            setErrorMessage("Please enter both email/username and password.");
            return;
        }

        // Check if email is valid
        if (!validateEmail(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        if (!confirmPassword || password != confirmPassword) {
            setErrorMessage("Password does not match!");
            return;
        }
        const payload = {
            name: username,
            email: email,
            password: password,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/consumer/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });


            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Sign up failed.");
                return;
            }

            const data = await response.json();

            // Show success message and switch to signin tab
            setSuccessMessage("Registration successful! Please sign in with your credentials.");

            // After showing success message, switch to signin tab
            setTimeout(() => {
                if (onTabChange) {
                    onTabChange("signin"); // Switch to signin tab
                }
            }, 2000); // 2 second delay

        } catch (error) {
            console.error("Error during register:", error);
            setErrorMessage("An error occurred. Please try again.");
        }
    };


    return (
        <div className="bg-gray-50 flex flex-col items-center justify-center space-y-4">
            {/* Main Login Card */}
            <div className="w-full max-w-s bg-white border border-gray-300 rounded-md p-8">
                {/* Zine Logo */}
                <div className="flex justify-center mb-6">
                    <Image src={myImg} width={70} height={70} alt="Zine" />
                </div>
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
                {successMessage && (
                    <div data-testid="success-message" className="mb-4 flex items-center justify-between bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
                        <span>{successMessage}</span>
                        <button
                            onClick={() => setSuccessMessage('')}
                            className="ml-4 font-bold focus:outline-none"
                        >
                            X
                        </button>
                    </div>
                )}
                <form>
                    <input
                        type="text"
                        placeholder="Enter Username"
                        className="mb-3 w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-400"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
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
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="mb-3 w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-400"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="w-full bg-blue-500 text-white py-2 rounded font-semibold text-sm hover:bg-blue-600 transition"
                        onClick={handleRegister}
                    >
                        Sign up
                    </button>
                    <div className="text-center text-sm text-gray-500 my-4">
                        OR
                    </div>
                    <div className="text-center">
                        <GoogleLoginButton setErrorMessage={setErrorMessage} />
                    </div>
                </form>
            </div>
        </div>
    );
}