import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signout } from "../Redux/Slice/AuthSlice";

function LogOutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const clickHandler = () => {
    toast.success("Successfully LogOut");
    dispatch(signout());
    navigate("/");
  };

  return (
    <div className="flex items-center mx-auto justify-center h-screen">
      <button
        className="px-2 py-1 bg-green-400 text-gray-200 border border-green-500 rounded-md hover:bg-green-200 transition-all translate-x-2"
        onClick={clickHandler}
      >
        Logout
      </button>
    </div>
  );
}

export default LogOutPage;
