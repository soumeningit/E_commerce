import React, { useState } from "react";
import { addProduct } from "../Redux/Slice/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LuIndianRupee } from "react-icons/lu";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import Modal from "./Modal";
import { addItemsToCart } from "../Service/Operations/CartOpern";
import toast from "react-hot-toast";

function ShowProductCard({
  image,
  productName,
  productPrice,
  shortDescription,
  productId,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const addToCart = async (e) => {
    e.stopPropagation();
    if (!token) {
      setShowModal(true);
    } else {
      const data = {
        productId,
        userId: user.id,
        quantity,
        product_price: productPrice,
        total_price: Number(productPrice) * Number(quantity),
      };

      try {
        const response = await addItemsToCart("POST", data, token);
        if (response.status === 200) {
          toast.success("Product added to cart");
        }
      } catch (error) {
        console.error("Add to cart error:", error);
      }
      dispatch(addProduct(data));
    }
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <>
      <div
        onClick={() => navigate(`/${productName}/product-details/${productId}`)}
        className="flex items-start gap-4 p-3 border rounded-lg bg-white hover:shadow-md cursor-pointer transition-all duration-200 max-w-xl mx-auto"
      >
        {/* Product Image */}
        <img
          src={image}
          alt={productName}
          className="w-24 h-24 object-contain rounded-md"
        />

        {/* Product Info */}
        <div className="flex-1 space-y-1">
          <h2 className="text-base font-semibold text-gray-800 line-clamp-1">
            {productName}
          </h2>

          <p className="text-sm text-gray-600 line-clamp-2 max-w-[15rem]">
            {shortDescription}
          </p>

          <div className="text-sm text-gray-800 flex items-center font-medium">
            <LuIndianRupee className="mr-1 text-base" />
            <span>{productPrice}</span>
          </div>

          {/* Quantity Controls & Add to Cart */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2 text-gray-600">
              <AiOutlineMinusCircle
                size={20}
                className="cursor-pointer hover:text-red-500"
                onClick={handleDecrease}
              />
              <span>{quantity}</span>
              <AiOutlinePlusCircle
                size={20}
                className="cursor-pointer hover:text-green-600"
                onClick={handleIncrease}
              />
            </div>

            <button
              onClick={addToCart}
              className="text-xs px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded transition cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          btn1={"Login"}
          btn2={"Cancel"}
          heading={"Login Required"}
          text={"Please login to add items to your cart."}
          onConfirm={() => {
            setShowModal(false);
            navigate("/login");
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default ShowProductCard;
