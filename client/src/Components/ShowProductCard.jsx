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
  const [quantity, setQuantity] = useState(1); // Local quantity state

  const addToCart = async () => {
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
          toast.success("Product added to cart successfully");
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
      dispatch(addProduct(data));
    }
  };

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="group relative flex flex-col w-full max-w-sm mx-auto bg-white rounded-2xl shadow-md transition-all duration-500 ease-in-out transform hover:shadow-lg hover:-translate-y-2 hover:scale-[1.02]">
      {/* Image */}
      <div className="overflow-hidden rounded-t-2xl">
        <img
          src={image}
          alt={productName}
          className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between h-full space-y-2">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 line-clamp-1">
          {productName}
        </h2>

        <p className="text-sm text-gray-600 line-clamp-2">{shortDescription}</p>

        <div className="flex items-center text-gray-700 text-base font-medium">
          <LuIndianRupee className="text-xl" />
          <span>{productPrice}</span>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-2 gap-3 text-gray-700">
          <button onClick={handleDecrease}>
            <AiOutlineMinusCircle
              size={24}
              className="hover:text-red-500 transition cursor-pointer"
            />
          </button>
          <span className="text-base font-medium">{quantity}</span>
          <button onClick={handleIncrease}>
            <AiOutlinePlusCircle
              size={24}
              className="hover:text-green-600 transition cursor-pointer"
            />
          </button>
        </div>

        {/* Add to Cart */}
        <button
          onClick={addToCart}
          className="w-full py-2 mt-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium shadow-md hover:brightness-110 transition duration-300 cursor-pointer"
        >
          Add To Cart
        </button>
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
    </div>
  );
}

export default ShowProductCard;
