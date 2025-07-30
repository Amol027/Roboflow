import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../Contexts/userContext";

const Signup = () => {
  const { signup, error } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    contact_number: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    const { name, contact_number, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userData = { name, contact_number, email, password };
    const result = await signup(userData);

    if (result.success) {
      alert("Signup successful! Please login.");
    } else {
      console.error(result.error);
    }
  };

  // ✅ Google Auth (redirect to FastAPI ngrok backend)
  const handleGoogleSignup = () => {
    window.location.href = "https://your-ngrok-subdomain.ngrok.io/auth/google"; // Replace with your ngrok URL
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-[#B726C5] to-[#506dff]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row items-center min-h-screen gap-8">
        {/* Left Side - Welcome Text */}
        <div className="w-full lg:w-1/2 text-white p-8 lg:p-12 flex items-center justify-center order-1 lg:order-1 text-center lg:text-left">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Come join us!</h2>
            <p className="text-lg lg:text-xl mb-6 opacity-90 leading-relaxed">
              We are so excited to have you here! If you haven't already, create
              an account to get access to exclusive offers, rewards, and
              discounts.
            </p>
            <p className="text-lg">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-white underline font-semibold hover:text-gray-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12 order-2 lg:order-2 rounded-lg">
          <div className="flex justify-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Signup</h2>
          </div>

          <div className="space-y-5">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              placeholder="Contact number"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            <button
              type="button"
              onClick={handleSignup}
              className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-[#B726C5] to-[#506dff] text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
            >
              Signup
            </button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-500 mb-4">or sign up with</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleGoogleSignup}
                className="p-3 border border-gray-400 rounded-full hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>

              <button className="p-3 border ml-4 border-gray-400 rounded-full hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
