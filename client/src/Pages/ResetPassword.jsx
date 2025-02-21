import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../Service/Operations/AuthOpern";
import { BiHide, BiShow } from "react-icons/bi";
import toast from "react-hot-toast";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = location.pathname.split("/")[2];
  console.log("Reset Token:", resetToken);

  const [formdata, setFormData] = useState({
    password: "",
    confirmPassword: "",
    token: resetToken ? resetToken : "",
  });

  const [error, setError] = useState("");
  const [color, setColor] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "password") {
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
      const password = e.target.value;
      const length = password.length;

      if (length < 4) {
        setError("Weak Password");
        setColor("red");
      } else if (length < 6) {
        setError("Medium Password");
        setColor("orange");
      } else {
        if (passwordRegex.test(password) && length > 6) {
          setError("Strong Password");
          setColor("green");
        } else {
          setError("Medium Password");
          setColor("orange");
        }
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formdata.password !== formdata.confirmPassword) {
      toast.error("Password and Confirm Password should be same");
      return;
    }
    if (formdata.password.length < 6) {
      toast.error("Password should be atleast 6 characters long");
      return;
    }
    console.log(formdata);
    try {
      resetPassword(formdata, "POST", navigate);
    } catch (error) {
      console.log("Error in Reset Password:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
          Reset Password
        </h1>
        <p className="text-gray-600 text-center mb-4">
          Reset your password here
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Field */}
          <div className="flex flex-col relative space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formdata.password}
              onChange={handleChange}
              required
              placeholder="1 uppercase, 1 lowercase, 1 digit, min 6 chars"
              className="w-full border border-gray-300 rounded-lg p-2 pr-10 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {showPassword ? (
              <BiShow
                className="absolute top-10 right-3 text-xl text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <BiHide
                className="absolute top-10 right-3 text-xl text-gray-600 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          <div>
            {error ? (
              <p style={{ color: color, fontSize: "14px" }}>{error}</p>
            ) : null}
          </div>
          {/* Confirm Password Field */}
          <div className="flex flex-col relative space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formdata.confirmPassword}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 pr-10 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {showConfirmPassword ? (
              <BiShow
                className="absolute top-10 right-3 text-xl text-gray-600 cursor-pointer"
                onClick={() => setShowConfirmPassword(false)}
              />
            ) : (
              <BiHide
                className="absolute top-10 right-3 text-xl text-gray-600 cursor-pointer"
                onClick={() => setShowConfirmPassword(true)}
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-all duration-300 cursor-pointer"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
