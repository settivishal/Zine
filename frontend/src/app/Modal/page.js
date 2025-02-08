"use client";
import { useState } from "react";
import SignUp from "../Signin/signup";
import SignIn from "../Signin/signin";

export default function AuthModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("signin"); // 'signin' or 'signup'

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-black-500 hover:text-gray-700">
                    X
                </button>

                {/* Tabs Header */}
                <div className="flex border-b border-gray-300 mb-4">
                    <button
                        onClick={() => setActiveTab("signin")}
                        className={`flex-1 py-2 text-center ${
                            activeTab === "signin"
                                ? "text-blue-500 border-b-2 border-blue-500 font-semibold"
                                : "text-gray-500 hover:text-blue-500"
                        }`}>
                        Sign In
                    </button>
                    <button
                        onClick={() => setActiveTab("signup")}
                        className={`flex-1 py-2 text-center ${
                            activeTab === "signup"
                                ? "text-blue-500 border-b-2 border-blue-500 font-semibold"
                                : "text-gray-500 hover:text-blue-500"
                        }`}>
                        Sign Up
                    </button>
                </div>

                {/* Tabs Content */}
                {/* Sign in Tab */}
                {activeTab === "signin" && <SignIn />}
                {/* Sign up Tab */}
                {activeTab === "signup" && <SignUp />}
            </div>
        </div>
    );
}
