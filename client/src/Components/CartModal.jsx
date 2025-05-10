import React, { useState } from "react";

function CartModal({
  image,
  name,
  price,
  addbtn,
  btn,
  onClose,
  quantity,
  setQuantity,
  totalPrice,
  setTotalPrice,
  onConfirm,
}) {
  const increment = () => {
    setQuantity((q) => q + 1);
    setTotalPrice((prevPrice) => Number(prevPrice) + Number(price));
  };
  const decrement = () => {
    if (quantity > 0) {
      setQuantity((q) => q - 1);
      setTotalPrice((prevPrice) => Number(prevPrice) - Number(price));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl transform transition-all duration-300 scale-100">
        <div className="flex flex-col items-center text-center">
          {image && (
            <img
              src={image}
              alt={name}
              className="w-32 h-32 object-cover rounded-xl mb-4"
            />
          )}
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">{name}</h2>
          <p className="text-gray-600 text-lg mb-4">₹{totalPrice}</p>

          {/* Quantity Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={decrement}
              className="w-10 h-10 rounded-full bg-red-100 text-red-600 text-xl font-bold hover:bg-red-200 cursor-pointer"
            >
              −
            </button>
            <span className="text-lg font-medium">{quantity}</span>
            <button
              onClick={increment}
              className="w-10 h-10 rounded-full bg-green-100 text-green-600 text-xl font-bold hover:bg-green-200 cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              disabled={quantity === 0}
              className={`px-4 py-2 rounded-lg w-full font-medium transition
                            ${
                              quantity === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                            }`}
              onClick={onConfirm}
            >
              {addbtn}
            </button>

            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg w-full transition cursor-pointer"
            >
              {btn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartModal;
