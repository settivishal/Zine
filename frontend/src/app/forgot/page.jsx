"use client";

import { useState } from 'react';
import Image from "next/image";
import myImg from "../../../public/zine.png";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSendLoginLink = async () => {
    // Clear any existing messages
    setMessage(null);

    // Validate email
    if (!email) {
      setMessage("Please enter your email address.");
      setIsError(true);
      return;
    }

    // Check if email is valid
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      setIsError(true);
      return;
    }

    try {
      const payload = {
        email: email,
      };
      const res = await fetch(`${API_BASE_URL}/consumer/forgot_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Reset link sent successfully!');
        setIsError(false);
      } else {
        setMessage(data.error || 'An error occurred. Please try again.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An unexpected error occurred. Please try again later.');
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      {/* Main Card - with smaller max width */}
      <div className="w-full max-w-sm bg-white border border-gray-300 rounded-lg p-8">
        {/* Zine Logo */}
        <div className="flex justify-center mb-6">
          <Image src={myImg} width={70} height={70} alt="Zine" />
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Trouble logging in?
        </h2>

        <p className="text-gray-500 text-center text-sm mb-4">
          Enter your email, and we'll send you a reset link.
        </p>

        {message && (
          <div
            className={`mb-4 flex items-center justify-between ${isError
              ? "bg-red-100 border border-red-400 text-red-700"
              : "bg-green-100 border border-green-400 text-green-700"
              } px-4 py-2 rounded text-sm`}
          >
            <span>{message}</span>
            <button
              onClick={() => setMessage(null)}
              className="ml-4 font-bold focus:outline-none"
            >
              X
            </button>
          </div>
        )}

        <input
          type="email"
          placeholder="Email address"
          className="mb-3 w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="button"
          className="w-full bg-blue-500 text-white py-2 rounded font-semibold text-sm hover:bg-blue-600 transition"
          onClick={handleSendLoginLink}
        >
          Send Password Reset Link
        </button>

        <div className="mt-6 text-center">
          <a href="/landing" className="text-sm text-blue-600 font-semibold hover:underline">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}