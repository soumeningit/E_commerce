import React, { useEffect, useState } from "react";
import { countryCode } from "../Utils/CountryCode";

import { useSelector } from "react-redux";
import {
  getUserDetailsAPI,
  updateUserDetailsAPI,
} from "../Service/Operations/ProfileAPI";
import toast from "react-hot-toast";

function UpdateDetails() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    gender: "",
    dob: "",
  });

  const [data, setData] = useState({});

  function handleChange(e) {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  const { user, token } = useSelector((state) => state.auth);

  async function updateUserDetails(event) {
    event.preventDefault();
    const toastId = toast.loading("Updating user details...");
    try {
      userData.userId = user.id;
      const response = await updateUserDetailsAPI(userData, token);
      toast.dismiss(toastId);
      if (response.status === 200) {
        alert("User details updated successfully!");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error updating user details. Please try again.");
      console.error("Error updating user details:", error);
    } finally {
      toast.dismiss(toastId);
    }
  }

  async function getUserDetails() {
    try {
      const response = await getUserDetailsAPI(user.id, token);
      if (response.status === 200) {
        setData(response.data.data);
        setUserData((prev) => ({
          ...prev,
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
          countryCode: response.data.data.country_code,
          phone: response.data.data.mobileNo,
          address: response.data.data.address,
          city: response.data.data.city,
          state: response.data.data.state,
          pinCode: response.data.data.pin_code,
          country: response.data.data.country,
        }));
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl">
      <form onSubmit={updateUserDetails} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Country Code
            </label>
            <select
              name="countryCode"
              value={userData.countryCode}
              onChange={handleChange}
              className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 focus:outline-none"
            >
              <option value="">Select Code</option>
              {countryCode.map((code) => (
                <option key={code.code} value={code.dial_code}>
                  {code.name} ({code.dial_code})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={userData.address}
              onChange={handleChange}
              className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              name="city"
              value={userData.city}
              onChange={handleChange}
              className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              name="state"
              value={userData.state}
              onChange={handleChange}
              className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Pin Code
            </label>
            <input
              type="text"
              name="pinCode"
              value={userData.pinCode}
              onChange={handleChange}
              className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              name="country"
              value={userData.country}
              onChange={handleChange}
              className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 focus:outline-none"
            >
              <option value="">Select Country</option>
              {countryCode.map((country, index) => (
                <option key={index} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={userData.gender}
              onChange={handleChange}
              className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 focus:outline-none"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={userData.dob}
              onChange={handleChange}
              className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 cursor-pointer focus:outline-none"
        >
          <span>Update Details</span>
          <svg
            className="w-5 h-5 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default UpdateDetails;
