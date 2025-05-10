import React, { useState } from "react";
import image from "../image/signup.png";
import { countryCode } from "../Utils/CountryCode";
import { role } from "../Utils/Role";
import { BiShow, BiHide } from "react-icons/bi";
import { sendOTP } from "../Service/Operations/AuthOpern";
import toast from "react-hot-toast";
import { setSignupData } from "../Redux/Slice/AuthSlice";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function SignUpPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    countryCode: "",
    mobileNumber: "",
    pinCode: "",
    address: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [color, setColor] = useState("");

  function handleChange(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));

    if (event.target.name === "password") {
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
      const password = event.target.value;
      const length = password.length;

      if (length < 4) {
        setError("Weak Password");
        setColor("red");
      } else if (length < 6) {
        setError("Medium Password");
        setColor("orange");
      } else {
        if (passwordRegex.test(password)) {
          setError("Strong Password");
          setColor("green");
        } else {
          setError("Medium Password");
          setColor("orange");
        }
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    // validation checks
    if (formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password should be same");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password should be minimum 6 characters");
      return;
    }
    if (formData.mobileNumber.length < 10) {
      toast.error("Mobile Number should be 10 digits");
      return;
    }
    if (formData.pinCode.length < 4) {
      toast.error("Pin Code should be at least 4 digits");
      return;
    }

    dispatch(setSignupData(formData));
    try {
      const response = await sendOTP("POST", {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      if (response.data.success) {
        navigate("/otp-verification");
      }
    } catch (error) {
      console.log("Error in sending OTP", error);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="grid lg:grid-cols-2 gap-4 bg-white shadow-lg rounded-lg w-full max-w-6xl overflow-hidden transition-all duration-500">
        <div className="flex items-center justify-center p-6 bg-gray-50">
          <img
            src={image}
            alt="registration_image"
            className="w-full max-w-md transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 font-serif italic mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-500 mb-6">
            Join us today and unlock exclusive deals, track your orders, and
            enjoy a personalized experience!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First and Last Name */}
            <div className="flex flex-col md:flex-row gap-4">
              {["firstName", "lastName"].map((field, i) => (
                <div key={i} className="w-full">
                  <label htmlFor={field} className="text-gray-700">
                    {field === "firstName" ? "First Name" : "Last Name"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md p-2 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md p-2 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="text-gray-700">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  required
                  className="w-[8rem] rounded-md p-2 bg-gray-200 focus:outline-none"
                >
                  {countryCode.map((code, index) => (
                    <option value={code.dial_code} key={index}>
                      {code.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md p-2 bg-gray-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="text-gray-700">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full rounded-md p-2 bg-gray-200 focus:outline-none"
              />
            </div>

            {/* Country */}
            <div className="flex flex-col gap-4">
              <label htmlFor="country" className="text-gray-700">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full rounded-md p-2 bg-gray-200 focus:outline-none"
              >
                <option value="" disabled>
                  Select Country
                </option>
                {countryCode.map((code, index) => (
                  <option value={code.name} key={index}>
                    {code.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Pin Code */}
            <div>
              <label htmlFor="pinCode" className="text-gray-700">
                Pin Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                required
                className="w-full rounded-md p-2 bg-gray-200 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 chars, 1 upper, 1 lower, 1 digit"
                required
                className="w-full rounded-md p-2 bg-gray-200 focus:outline-none"
              />
              {showPassword ? (
                <BiShow
                  className="absolute right-2 top-10 text-xl cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <BiHide
                  className="absolute right-2 top-10 text-xl cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            {error && <p className={`text-${color}-600 text-sm`}>{error}</p>}

            {/* Confirm Password */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-md p-2 bg-gray-200 focus:outline-none"
              />
              {showConfirmPassword ? (
                <BiShow
                  className="absolute right-2 top-10 text-xl cursor-pointer"
                  onClick={() => setShowConfirmPassword(false)}
                />
              ) : (
                <BiHide
                  className="absolute right-2 top-10 text-xl cursor-pointer"
                  onClick={() => setShowConfirmPassword(true)}
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-all duration-300 cursor-pointer"
            >
              Sign Up
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
