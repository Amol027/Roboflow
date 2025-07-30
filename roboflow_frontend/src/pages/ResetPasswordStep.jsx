import React from 'react';
import { Link } from 'react-router-dom';
import BASE_URL from "../utils/Config";

const ResetPasswordStep = ({ email, otp, newPassword, setNewPassword, onReset }) => {
  const handleResetPassword = async () => {
    try {
      const response = await fetch(
        ` ${BASE_URL}/auth/reset-password?email=${email}&otp=${otp.join('')}&new_password=${newPassword}`,
        { method: "POST" }
      );
      if (!response.ok) throw new Error("Reset failed");
      onReset();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Reset Password</h1>
          <p className="text-green-600 text-sm mb-8">OTP Verified Successfully!</p>

          <div className="space-y-4 md:space-y-6">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 md:py-4 border border-gray-300 rounded-lg text-gray-500 placeholder-gray-400"
            />

            <button
              onClick={handleResetPassword}
              className="w-full bg-gradient-to-r from-[#B726C5] to-[#506dff] text-white py-3 md:py-4 px-4 rounded-lg font-medium text-lg"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#B726C5] to-[#506dff] flex items-center justify-center p-6 lg:p-12">
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Welcome Back!</h2>
          <p className="text-lg md:text-xl mb-1">Reset your password quickly and securely</p>
          <p className="text-lg md:text-xl mb-8 md:mb-12">in just a few steps</p>
          <Link to="/" className="inline-block border-2 border-white text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-medium">
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordStep;