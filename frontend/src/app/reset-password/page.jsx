"use client";

import { useState, useEffect } from 'react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    // Moving the URLSearchParams to useEffect to avoid window is not defined error
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    setToken(tokenParam);
  }, []);

  const handleResetPassword = async () => {
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Please enter both password fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const payload = {
        token: token,
        password: password,
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
        // Clear form after success
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      {/* Main Card - with consistent width */}
      <div className="w-full max-w-sm bg-white border border-gray-300 rounded-lg p-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Reset Your Password
        </h2>

        <p className="text-gray-500 text-center text-sm mb-4">
          Enter your new password below.
        </p>

        {error && (
          <div className="mb-4 flex items-center justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-4 font-bold focus:outline-none"
            >
              X
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center justify-between bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
            <span>{success}</span>
            <button
              onClick={() => setSuccess('')}
              className="ml-4 font-bold focus:outline-none"
            >
              X
            </button>
          </div>
        )}

        <input
          type="password"
          placeholder="New password"
          className="mb-3 w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          className="mb-3 w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-1 focus:ring-gray-400"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="button"
          className="w-full bg-blue-500 text-white py-2 rounded font-semibold text-sm hover:bg-blue-600 transition"
          onClick={handleResetPassword}
        >
          Reset Password
        </button>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Password must be different from previously used passwords</p>
        </div>

        <div className="mt-6 text-center">
          <a href="/signin" className="text-sm text-blue-600 font-semibold hover:underline">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
