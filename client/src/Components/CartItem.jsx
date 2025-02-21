import React, { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { removeProduct } from "../Redux/Slice/CartSlice";
import toast from "react-hot-toast";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { FaRupeeSign } from "react-icons/fa";
import { deleteItemsFromCart } from "../Service/Operations/CartOpern";

function CartItem({
  item,
  updateTotalAmount,
  productQuantity,
  setProductQuantity,
}) {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const productId = item.productDetails.product_id;
  const productPrice = item.productDetails.product_mrp;
  // const productPrice = 0;
  const [quantity, setQuantity] = useState(0);

  const removeFromCart = async () => {
    // dispatch(removeProduct(productId));
    // toast.success("Item Removed");
    try {
      const deleteResponse = await deleteItemsFromCart(
        "DELETE",
        { productId },
        token
      );
      if (!deleteResponse.data.success) {
        throw new Error(deleteResponse.data.message);
      }
      toast.success("Item removed from cart");
    } catch (error) {
      console.log("Error in remove from cart: ", error);
    }
    updateTotalAmount(-quantity * productPrice); // Subtract removed item's price
  };

  const addQuantity = () => {
    setQuantity((prev) => prev + 1);
    updateTotalAmount(productPrice);
    console.log("productQuantity: ", productQuantity);
    setProductQuantity((prev) => ({
      ...prev,
      [productId]: quantity + 1,
    }));
  };

  const reduceQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      updateTotalAmount(-productPrice);
      console.log("productQuantity: ", productQuantity);
      setProductQuantity((prev) => ({
        ...prev,
        [productId]: quantity - 1,
      }));
    }
  };

  console.log("productQuantity outside : ", productQuantity);

  return (
    <div className="flex flex-col items-center p-2 md:p-5 justify-between mt-2 mb-2 md:mx-5">
      <div className="flex flex-col md:flex-row p-0 md:p-3 gap-5 items-center">
        <div className="w-[30%]">
          <img
            className="object-cover"
            src={item?.productDetails?.product_image}
            alt="product"
          />
        </div>

        <div className="md:ml-10 self-start space-y-5 w-[100%] md:w-[70%]">
          <h1 className="text-xl text-slate-700 font-semibold">
            {item?.productDetails?.product_name}
          </h1>
          <div className="flex justify-between">
            <div className="flex items-center justify-between">
              <p className="font-bold text-xl text-green-600 flex space-x-1">
                <FaRupeeSign className="mt-2" />
                {item?.productDetails?.product_mrp}
              </p>
            </div>

            <div
              className="text-red-800 bg-red-200 group hover:bg-red-400 transition-transform duration-300 cursor-pointer rounded-full p-3 mr-3"
              onClick={removeFromCart}
            >
              <RiDeleteBinLine />
            </div>

            <div className="flex gap-4">
              <div
                onClick={reduceQuantity}
                className="bg-gray-200 rounded-full flex items-center justify-center transition-all transform duration-150 hover:scale-110 cursor-pointer w-8 h-8"
              >
                <IoRemoveCircleOutline className="p-1 text-gray-600 text-4xl font-bold" />
              </div>
              <p className="text-2xl font-bold">{quantity}</p>
              <div
                onClick={addQuantity}
                className="bg-gray-200 rounded-full flex items-center justify-center transition-all transform duration-150 hover:scale-110 cursor-pointer w-8 h-8"
              >
                <IoAddCircleOutline className="p-1 text-gray-600 text-4xl font-bold" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[0.08rem] w-full bg-gray-400"></div>
    </div>
  );
}

export default CartItem;
