"use client"
import { useState } from "react";
import SignUp from "../Signup/page";
import SignIn from "../Signin/page";

export default function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("signin"); // 'signin' or 'signup'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        {/* Tabs Header */}
        <div className="flex border-b border-gray-300 mb-4">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-2 text-center ${
              activeTab === "signin"
                ? "text-blue-500 border-b-2 border-blue-500 font-semibold"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2 text-center ${
              activeTab === "signup"
                ? "text-blue-500 border-b-2 border-blue-500 font-semibold"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Tabs Content */}
        {activeTab === "signin" && <SignIn/>
        // (
        //   <div>
        //     <form>
        //       <input
        //         type="email"
        //         placeholder="Email"
        //         className="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
        //       />
        //       <input
        //         type="password"
        //         placeholder="Password"
        //         className="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
        //       />
        //       <button
        //         type="submit"
        //         className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        //       >
        //         Sign In
        //       </button>
        //     </form>
        //   </div>
        // )
        }

        {activeTab === "signup" && <SignUp />}
      </div>
    </div>
  );
}
