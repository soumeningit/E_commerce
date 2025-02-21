import React, { useState } from "react";
import bgimage from "../image/log_in_bg_img.jpg";
import { BiHide, BiShow } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../Service/Operations/AuthOpern";
import { useDispatch } from "react-redux";

function LogInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    try {
      loginUser(formData, "POST", navigate, dispatch);
    } catch (error) {
      console.log("Error while log in:", error);
    }
  };

  return (
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white bg-opacity-10 backdrop-blur-md shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        {/* Left Side */}
        <div className="flex flex-col justify-center items-center p-8 bg-opacity-20">
          <h1 className="text-3xl font-bold italic text-gray-800">
            WELCOME BACK
          </h1>
          <p className="mt-4 text-center text-gray-700">
            Log in to access your account, track orders, manage preferences, and
            shop your favorite items with ease. Happy shopping!
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-center text-2xl font-bold italic text-gray-800">
              Sign In
            </h1>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-gray-800 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2 relative">
              <label className="text-gray-800 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-3 text-gray-600 text-xl"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <BiShow /> : <BiHide />}
                </button>
              </div>
            </div>

            {/* Forget Password */}
            <p
              onClick={() => navigate("/forgot-password")}
              className="text-right text-blue-500 hover:underline cursor-pointer text-sm"
            >
              Forgot Password?
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Log In
            </button>
            <p className="text-center text-gray-700">
              Don't have an account?{" "}
              <Link to="/signup" className="text-cyan-600">
                Sign Up
              </Link>{" "}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogInPage;
