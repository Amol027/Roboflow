import React, { useRef, useEffect, useState } from 'react';
import BASE_URL from "../utils/Config";

const OtpVerificationStep = ({ email, otp, setOtp, onNext }) => {
  const inputsRef = useRef([]);
  const [timer, setTimer] = useState(60); // 60 seconds countdown
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      setIsExpired(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const joinedOtp = otp.join('');
    try {
      const response = await fetch(
        ` ${BASE_URL}/auth/verify-otp?email=${email}&otp=${joinedOtp}`,
        { method: "POST" }
      );
      if (!response.ok) throw new Error("OTP verification failed");
      onNext();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left - Welcome Text */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#B726C5] to-[#506dff] flex items-center justify-center p-6 lg:p-12">
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Welcome Back!</h2>
          <p className="text-lg md:text-xl mb-1">Reset your password quickly and securely</p>
          <p className="text-lg md:text-xl mb-8">in just a few steps</p>
          <button className="border-2 border-white text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-medium">
            Back to Signin
          </button>
        </div>
      </div>

      {/* Right - OTP Input Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Forgot Password</h1>
          <p className="text-blue-500 text-sm mb-8 md:mb-12">An OTP has been sent to {email}</p>

          <div className="flex justify-center gap-2 md:gap-4 mb-6 md:mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-10 h-12 md:w-16 md:h-16 text-center text-2xl border-2 border-gray-300 rounded-lg"
              />
            ))}
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={isExpired}
            className={`w-full bg-gradient-to-r from-[#B726C5] to-[#506dff] text-white py-3 md:py-4 px-4 rounded-lg font-medium text-lg mb-4 ${
              isExpired ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform'
            }`}
          >
            Verify OTP
          </button>

          <p className="text-gray-600 text-sm">
            {isExpired ? 'OTP expired. Please request a new one.' : `OTP expires in: ${timer}s`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationStep;
