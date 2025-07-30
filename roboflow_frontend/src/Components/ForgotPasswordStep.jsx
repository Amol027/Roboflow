import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordStep = ({ email, setEmail, onNext }) => {
  const handleSendOtp = async () => {
    try {
      const response = await fetch("  https://7ecc03ab1ee4.ngrok-free.app/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Failed to send OTP");
      onNext();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-[#B726C5] to-[#506dff]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row items-center min-h-screen gap-8">
        
        {/* ✅ Left - Welcome Text */}
        <div className="w-full lg:w-1/2 text-white p-6 sm:p-8 lg:p-12 order-1 flex items-center justify-center text-center lg:text-left">
          <div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">Welcome back!</h2>
            <p className="text-lg lg:text-2xl font-bold lg:font-normal leading-relaxed opacity-90">
              Reset your password quickly and securely in just a few steps.
            </p>
          </div>
        </div>

        {/* ✅ Right - Forgot Password Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 bg-white bg-opacity-90 rounded-lg order-2">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Forgot Password</h2>
          <p className="text-sm mb-6 text-gray-600 text-center">
            Enter your email to receive a password reset OTP.
          </p>

          <div className="space-y-5">
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            <button
              onClick={handleSendOtp}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#B726C5] to-[#506dff] text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
            >
              Send OTP
            </button>
          </div>

          <div className="text-center mt-6">
            <Link
              to="/"
              className="inline-block text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordStep;
