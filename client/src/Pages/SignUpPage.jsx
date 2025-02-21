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
    countryCode: "",
    mobileNumber: "",
    address: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [color, setColor] = useState("");

  function handleChange(event) {
    setFormData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });

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
        if (passwordRegex.test(password) && length > 6) {
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
    console.log(formData);
    if (formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password should be same");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password should be minimum 6 characters");
      return;
    }
    if (formData.mobileNumber.length < 10) {
      toast.error("Mobile Number should be 10 characters");
      return;
    }
    dispatch(setSignupData(formData));
    try {
      const response = await sendOTP("POST", {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      console.log("OTP Sent Successfully", response);
      if (response.data.success) {
        navigate("/otp-verification");
      }
    } catch (error) {
      console.log("Error in sending OTP", error);
    }
  }

  return (
    <div className="bg-gray-200">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col m-4 p-4 rounded-md">
          <img
            src={image}
            alt="registration_image"
            className="h-[75%] w-[75%] border-1 border-gray-200 rounded-md p-4"
            loading="lazy"
          />
        </div>
        <div className="w-full m-4 p-4 rounded-md">
          <h1 className="text-xl font-bold italic font-serif text-start">
            Create Your Account
          </h1>
          <p className="text-start font-serif text-gray-500 mt-5">
            Join us today and unlock exclusive deals, track your orders, and
            enjoy a personalized shopping experience. It’s quick and easy to get
            started!
          </p>
          <form onSubmit={handleSubmit} className="w-[90%] mt-[6rem] space-y-2">
            <div className="flex flex-row space-x-4">
              <div className="w-full flex flex-col">
                <label htmlFor="firstName" className="text-start">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full border-1 border-gray-200 rounded-md p-2 bg-gray-400 text-white focus:outline-none"
                />
              </div>
              <div className="w-full flex flex-col">
                <label htmlFor="lastName" className="text-start">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full border-1 border-gray-200 rounded-md p-2 bg-gray-400 text-white focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-start">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border-1 border-gray-200 rounded-md p-2 bg-gray-400 text-white focus:outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone" className="text-start">
                Contact Number
              </label>
              <div className="flex flex-row space-x-2">
                <select
                  name="countryCode"
                  id="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  required
                  className="border-1 w-24 border-gray-200 rounded-md p-2 bg-gray-400 text-gray-900 focus:outline-none"
                >
                  {countryCode.map((code, index) => {
                    return (
                      <option value={code.dial_code} key={index}>
                        {code.name}
                      </option>
                    );
                  })}
                </select>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  className="w-full border-1 border-gray-200 rounded-md p-2 bg-gray-400 text-gray-900 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="address" className="text-start">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full border-1 border-gray-200 rounded-md p-2 bg-gray-400 text-white focus:outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="role" className="text-start">
                Role
              </label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full border-1 border-gray-200 rounded-md p-2 bg-gray-400 text-white focus:outline-none"
              >
                {role.map((role, i) => {
                  return (
                    <option value={role.value} key={i}>
                      {role.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col relative">
              <label htmlFor="password" className="text-start">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password must contain 1 uppercase, 1 lowercase, 1 digit and minimum 6 characters"
                className="w-full border-1 border-gray-200 rounded-md p-2 bg-gray-400 text-white focus:outline-none"
              />
              {showPassword ? (
                <BiShow
                  className="absolute top-4 right-2 translate-y-5 text-xl cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <BiHide
                  className="absolute top-4 right-2 translate-y-5 text-xl cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            {error ? (
              <p style={{ color: color, fontSize: "14px" }}>{error}</p>
            ) : null}
            <div className="flex flex-col relative">
              <label htmlFor="confirmPassword" className="text-start">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full border-1 border-gray-200 rounded-md p-2 bg-gray-400 text-white focus:outline-none"
              />
              {showConfirmPassword ? (
                <BiShow
                  className="absolute top-4 right-2 translate-y-5 text-xl cursor-pointer"
                  onClick={() => setShowConfirmPassword(false)}
                />
              ) : (
                <BiHide
                  className="absolute top-4 right-2 translate-y-5 text-xl cursor-pointer"
                  onClick={() => setShowConfirmPassword(true)}
                />
              )}
            </div>
            <div className="flex flex-col">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md cursor-pointer"
              >
                SignUp
              </button>
            </div>
            <p className="text-center text-gray-700">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-400">
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
