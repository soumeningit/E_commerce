import React, { use, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function UserLink({ setShowUserLink }) {
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowUserLink(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowUserLink]);
  return (
    <div
      ref={modalRef}
      className="absolute top-2 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200"
    >
      <div className="flex justify-end p-2">
        <button
          onClick={() => setShowUserLink(false)}
          className="text-red-400 hover:text-red-800 cursor-pointer font-bold"
        >
          ✕
        </button>
      </div>
      <ul className="flex flex-col space-y-2 p-2">
        <li
          onClick={() => navigate("/dashboard/myprofile")}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
        >
          Profile
        </li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">
          Contact Us
        </li>
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">
          Logout
        </li>
      </ul>
    </div>
  );
}

export default UserLink;
