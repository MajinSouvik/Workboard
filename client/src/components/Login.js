import React, { useRef } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    // Handle form submission (e.g., authenticate user)
    const status = await loginUser(username, password);
    if (status) {
      // Navigate to the homepage if login is successful
      navigate("/");
    } else {
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center relative">
      {/* Heading at the top-left */}
      <div className="absolute top-4 left-4">
        <h1 className="text-3xl font-bold text-indigo-600">WorkBoards</h1>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md bg-white shadow-md rounded p-8 space-y-4">
        <h2 className="text-2xl font-bold text-center">Login to Your Account</h2>

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

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Login
            </button>
          </div>
        </form>

        {/* Registration Link */}
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            Register here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
