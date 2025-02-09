"use client";
// import { useRouter } from 'next/router';
import axiosInstance from "../../../helpers/axiosInstance";
import Image from "next/image";
import myImg from "../zine.png";

import { useState } from "react";

export default function SignUp (){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState(""); // Error message state

    // Handle form submission from Login Button
    const handleRegister = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (!username || !email || !password) {
            setErrorMessage("Please enter both email/username and password.");
            return;
        }
        if(!confirmPassword || password != confirmPassword){
            setErrorMessage("Password does not match!");
            return;
        }
        const payload = {
            name : username,
            email: email,
            password: password,
        };
    
        try {
            
            
            const response = await axiosInstance.post('/consumer/register', payload);
            // const { message, email, name } = response.data;
        
            return response.data;
        } catch (error) {
            console.error('Sign Up Error:', error.response?.data || error.message);
            throw error.response?.data || error.message;
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
                    {errorMessage && (
                        <div className="mb-4 text-red-600 text-sm">
                            {errorMessage}
                        </div>
                    )}
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="mb-3 w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-400"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errorMessage && (
                        <div className="mb-4 text-red-600 text-sm">
                            {errorMessage}
                        </div>
                    )}
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
                        <button
                            type="button"
                            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200">
                            <svg
                                className="w-5 h-5 mr-2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Login with Google
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
