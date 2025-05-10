import React from "react";
import { LuCheck } from "react-icons/lu";
import { FaArrowRightLong } from "react-icons/fa6";

function VerifiedModal({ title, message, bt1, bt2, onClick, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 transform scale-95 relative">
        <style>
          {`
            @keyframes pop-in {
              0% {
                transform: scale(0.8);
                opacity: 0;
              }
              100% {
                transform: scale be: scale(1);
                opacity: 1;
              }
            }
            .animate-pop-in {
              animation: pop-in 0.3s ease-out forwards;
            }
          `}
        </style>
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center cursor-pointer">
            <LuCheck className="text-green-600" size={28} />
          </div>
        </div>
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClick}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 cursor-pointer"
          >
            {bt2} <FaArrowRightLong />
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifiedModal;
