import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AlertModal from "./AlertModal";
import { addToCart } from "../Redux/Slice/CartSlice";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { addItemsToCart } from "../Service/Operations/CartOpern";
import toast from "react-hot-toast";

function ProductDetails() {
  const { product } = useSelector((state) => state.product);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  const params = useParams();
  const dispatch = useDispatch();

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  async function handleAddToCart() {
    if (!token) {
      setShowAlertModal(true);
      return;
    }
    const data = {
      userId: user.id,
      productId: params?.id,
    };
    const toastId = toast.loading("Adding to cart...");
    try {
      const response = await addItemsToCart("POST", data, token);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Product added to cart successfully");
      toast.dismiss(toastId);
      dispatch(addToCart(product));
    } catch (error) {
      toast.dismiss(toastId);
      console.log("Error in add cart item", error);
    } finally {
      toast.dismiss(toastId);
    }
  }

  return (
    <div className="flex flex-col justify-center mx-auto bg-[#f8f6f3d7] my-10 p-4 w-[90%] rounded-md">
      <h1 className="text-center text-xl font-bold font-serif italic">
        Product Details
      </h1>
      <div className="grid grid-cols-2 gap-4 my-10">
        <div className="">
          <img src={product?.product_image} alt="product" loading="lazy" />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-bold">{product?.product_name}</h1>
          <p>{product?.description}</p>
          <p>Price: ₹ {product?.product_mrp}</p>
          {/* <div className="flex gap-4">
            <div
              onClick={() => {
                if (quantity > 0) {
                  setQuantity(quantity - 1);
                }
              }}
              className="bg-gray-200 rounded-full flex items-center justify-center transition-all transform duration-150 hover:scale-110 cursor-pointer w-8 h-8"
            >
              <IoRemoveCircleOutline className="p-1 text-gray-600 text-4xl font-bold" />
            </div>
            <p className="text-2xl font-bold">{quantity}</p>
            <div
              onClick={() => setQuantity(quantity + 1)}
              className="bg-gray-200 rounded-full flex items-center justify-center transition-all transform duration-150 hover:scale-110 cursor-pointer w-8 h-8"
            >
              <IoAddCircleOutline className="p-1 text-gray-600 text-4xl font-bold" />
            </div>
          </div> */}
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white p-2 rounded-md w-[10rem] hover:bg-blue-700 transition-all transform duration-150 hover:scale-110 cursor-pointer"
          >
            Add to cart
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center relative">
        {showAlertModal && <AlertModal setShowAlertModal={setShowAlertModal} />}
      </div>
    </div>
  );
}

export default ProductDetails;
