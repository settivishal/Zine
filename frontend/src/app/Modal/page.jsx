"use client";
import { useState } from "react";
import SignUp from "../signinn/signup";
import SignIn from "../signinn/signin";
import { useAuth } from '../../hooks/authcontext';

export default function AuthModal({ isOpen, onClose }) {
    const { accessToken } = useAuth();
    const [activeTab, setActiveTab] = useState("signin"); // 'signin' or 'signup'
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    // Handler to change tab and optionally show registration success message
    const handleTabChange = (tab, showSuccessMessage = false) => {
        setActiveTab(tab);
        setRegistrationSuccess(showSuccessMessage);
    };

    // Add token expiration check function

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Modal Content */}
            <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-black-500 text-xl hover:text-gray-700">
                    ❎
                </button>

                {/* Tabs Header */}
                <div className="flex border-b border-gray-300 mb-4">
                    <button
                            onClick={() => handleTabChange("signin")}
                            className={`flex-1 py-2 text-center ${activeTab === "signin"
                                ? "text-blue-500 border-b-2 border-blue-500 font-semibold"
                                : "text-gray-500 hover:text-blue-500"
                                }`}>
                            Sign In
                        </button>

                    <button
                        onClick={() => handleTabChange("signup")}
                        className={`flex-1 py-2 text-center ${activeTab === "signup"
                            ? "text-blue-500 border-b-2 border-blue-500 font-semibold"
                            : "text-gray-500 hover:text-blue-500"
                            }`}>
                        Sign Up
                    </button>
                </div>

                {/* Registration Success Message */}
                {registrationSuccess && activeTab === "signin" && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
                        Registration successful! Please sign in with your credentials.
                    </div>
                )}

                {/* Tabs Content */}
                {/* Sign in Tab */}
                {activeTab === "signin" && <SignIn />}
                {/* Sign up Tab */}
                {activeTab === "signup" && (
                    <SignUp
                        onTabChange={(tab) => handleTabChange(tab, true)}
                    />
                )}
            </div>
        </div>
    );
}