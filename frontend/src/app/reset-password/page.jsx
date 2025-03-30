"use client";

import { useState } from 'react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

console.log(token); // d9f25de6a94be14c8c63c9a8a98f4ae85d21a7d290c600eef605a0be9e874878


  const handleResetPassword = async () => {
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const payload = {
        token : token,
        password : password,
      };

      const response = await fetch('http://localhost:8080/consumer/reset_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset successfully');
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-4">
      <div className="w-full max-w-xs bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Reset Your Password
          </h2>

          <p className="text-gray-500 text-center text-sm mb-4">
            Enter your new password below.
          </p>


          <input
            type="password"
            placeholder="New password"
            className="w-full text-gray-500 px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full text-gray-500 px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

            {error && (
            <div className="w-full p-3 mb-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="w-full p-3 mb-4 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <button 
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
            onClick={handleResetPassword}
          >
            Reset Password
          </button>
        

          <div className="mt-4 text-xs text-gray-500">
            <p>Password must be different from previously used Passwords</p>
          </div>
        </div>
      </div>

      <a href="/landing" className="text-sm text-blue-600 font-semibold hover:underline">
        Back to login
      </a>
    </div>
  );
}
