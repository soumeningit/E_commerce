import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiEdit2 } from "react-icons/fi";
import { getUserDetailsAPI } from "../Service/Operations/ProfileAPI";
// import SellProducts from "./SellProducts";
// import RentProducts from "./RentProducts";

function MyProfile() {
  const { user, token } = useSelector((state) => state.auth);
  const [userDetails, setUserDetails] = useState({});

  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const response = await getUserDetailsAPI(user.id, token);
      if (response.status === 200) {
        setUserDetails(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="w-full bg-gray-50 py-8 px-4 overflow-hidden">
      <div className="mx-auto bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>
          <button
            onClick={() => navigate("/dashboard/setting")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition duration-200 cursor-pointer"
          >
            <FiEdit2 size={18} />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
          <div>
            <p className="font-medium">First Name:</p>
            <p>{userDetails.firstName}</p>
          </div>
          <div>
            <p className="font-medium">Last Name:</p>
            <p>{userDetails.lastName}</p>
          </div>
          <div>
            <p className="font-medium">Email:</p>
            <p>{userDetails.email}</p>
          </div>
          <div>
            <p className="font-medium">Contact No:</p>
            <p>{userDetails.mobileNo}</p>
          </div>
          <div>
            <p className="font-medium">Address:</p>
            <p>{userDetails.address}</p>
          </div>
          <div>
            <p className="font-medium">State:</p>
            <p>{userDetails.state}</p>
          </div>
          <div>
            <p className="font-medium">Country:</p>
            <p>{userDetails.country}</p>
          </div>
          <div>
            <p className="font-medium">Pincode:</p>
            <p>{userDetails.pin_code}</p>
          </div>
          <div className="md:col-span-2">
            <p className="font-medium">Joined On:</p>
            <p>{new Date(userDetails.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* <div className="max-w-4xl mx-auto mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Your Products
        </h3>
        <SellProducts />
        <RentProducts />
      </div> */}
    </div>
  );
}

export default MyProfile;
