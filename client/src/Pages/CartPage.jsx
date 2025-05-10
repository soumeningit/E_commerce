import React, { useEffect, useState } from "react";
import {
  deleteItemsFromCart,
  getCartItems,
} from "../Service/Operations/CartOpern";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "../Components/CartItem";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { initiatePayment } from "../Service/Operations/PaymentOpern";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  const { token, user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await getCartItems("GET", token, { userId: user.id });
        const items = response.data?.data;
        if (items) {
          setCartItems(items);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = async (id) => {
    try {
      const response = await deleteItemsFromCart(
        "DELETE",
        { productId: id },
        token
      );
      if (response.status === 200) {
        toast.success("Item removed successfully");
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price_per_item) * item.quantity,
    0
  );

  async function handleShopNow() {
    const data = {};
    data.cartItems = cartItems;
    data.userId = user.id;
    try {
      const response = await initiatePayment(
        "POST",
        data,
        token,
        navigate,
        dispatch
      );
    } catch (error) {
      console.log("Payment failed: ", error);
    }
  }

  return (
    <div className="flex justify-between p-4">
      <div className="w-[60rem]">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))
        ) : (
          <div className="text-center text-xl font-semibold flex flex-col items-center justify-center h-full">
            Your cart is empty.
            <button
              onClick={() => navigate("/")}
              className="bg-green-700 hover:bg-purple-50 rounded-lg 
                text-white transition duration-300 ease-linear mt-5 border
                border-green-400 text-md hover:text-green-700 px-2 py-1 cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        )}
      </div>

      <div className="w-1/4 p-4 border rounded shadow-md h-fit">
        <h3 className="text-xl font-semibold mb-2">Total Amount</h3>
        <p className="text-lg font-bold text-green-700">
          ₹{totalAmount.toFixed(2)}
        </p>
        <button
          onClick={handleShopNow}
          className="bg-green-700 hover:bg-purple-50 rounded-lg 
                text-white transition duration-300 ease-linear mt-5 border
                border-green-400 text-md hover:text-green-700 px-2 py-1 cursor-pointer"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default CartPage;
