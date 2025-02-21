import React from "react";
import { useNavigate } from "react-router-dom";

function AlertModal({ setShowAlertModal }) {
  const navigate = useNavigate();
  return (
    <div
      id="popup-modal"
      tabIndex="-1"
      className="fixed inset-0 z-50 flex justify-center items-center bg-[#f1f1f1f1] bg-opacity-50"
    >
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setShowAlertModal(false)}
          className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center"
        >
          ✕
        </button>

        {/* Alert Icon */}
        <div className="text-center">
          <svg
            className="mx-auto mb-4 text-gray-400 w-12 h-12"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <h3 className="mb-5 text-lg font-semibold text-gray-700">
            To add this product to cart, you need to login first.
          </h3>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                navigate("/login");
                setShowAlertModal(false);
              }}
              className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-800 transition"
            >
              Login
            </button>
            <button
              onClick={() => setShowAlertModal(false)}
              className="bg-gray-200 text-gray-900 px-5 py-2.5 rounded-lg hover:bg-gray-300 transition"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
