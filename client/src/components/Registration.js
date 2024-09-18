import React, { useRef } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const Registration = () => {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Call registerUser service
    const status = await registerUser(username, email, password);
    
    if (status) {
      // Navigate to Login page if registration is successful
      navigate("/login");
    } else {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center relative">
      {/* Heading at the top-left */}
      <div className="absolute top-4 left-4">
        <h1 className="text-3xl font-bold text-indigo-600">WorkBoards</h1>
      </div>

      {/* Registration Form */}
      <div className="w-full max-w-md bg-white shadow-md rounded p-8 space-y-4">
        <h2 className="text-2xl font-bold text-center">Create an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              ref={usernameRef}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              ref={emailRef}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              ref={passwordRef}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              ref={confirmPasswordRef}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Register
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
};

export default Registration;
