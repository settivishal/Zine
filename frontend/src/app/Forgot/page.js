"use client";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
      {/* Main Forgot Password Card */}
      <div className="w-full max-w-xs bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center">
          {/* Lock Icon */}
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
                d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Trouble logging in?
          </h2>

          <p className="text-gray-500 text-center text-sm mb-4">
            Enter your email, and we'll send you a reset link.
          </p>

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Send Reset Link Button */}
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition">
            Send Login Link
          </button>

          {/* Help & Alternative Options */}
          <button className="text-blue-500 text-sm mt-3 hover:underline">
            Can't reset your password?
          </button>

          <div className="w-full flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <a href="/login" className="text-gray-600 font-semibold text-sm hover:underline">
            Create New Account
          </a>
        </div>
      </div>

      {/* Back to Login */}
      <a href="/login" className="text-sm text-blue-600 font-semibold hover:underline">
        Back to login
      </a>
    </div>
  );
}
