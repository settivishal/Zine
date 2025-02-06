// pages/forgot-password.js
const ForgotPassword = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white">
          <div className="flex flex-col items-center">
            {/* Lock Icon */}
            <div className="w-24 h-24 mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-gray-400" 
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
  
            <h2 className="text-2xl font-semibold mb-2">
              Trouble with logging in?
            </h2>
            
            <p className="text-gray-600 text-center mb-6">
              Enter your email address, and we'll send you a link to get back into your account.
            </p>
  
            <input
              type="text"
              placeholder="Email address, phone number or username"
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
  
            <button className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold mb-4 hover:bg-blue-600">
              Send Login Link
            </button>
  
            <button className="text-blue-500 text-sm mb-8">
              Can't reset your password?
            </button>
  
            <div className="w-full flex items-center mb-8">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
  
            <button className="font-semibold text-sm mb-8">
              Create New Account
            </button>
          </div>
  
          <div className="border-t border-gray-300 pt-6">
            <button className="w-full text-blue-500 font-semibold">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ForgotPassword;
  