import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import CartItem from "../Components/CartItem";
import { getCartItems } from "../Service/Operations/CartOpern";
import { initiatePayment } from "../Service/Operations/PaymentOpern";

function CartPage() {
  const { token, user } = useSelector((state) => state.auth);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [productQuantity, setProductQuantity] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCartItem() {
      try {
        const storedUser = typeof user === "string" ? JSON.parse(user) : user;
        const response = await getCartItems("GET", token, {
          userId: storedUser?.id,
        });

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setCart(data);

        console.log("data : ", data);

        // Calculate initial total price
        // let total = data.reduce(
        //   (acc, item) => acc + item.productDetails.product_mrp,
        //   0
        // );

        // console.log("Total Amount: ", total);

        // setTotalAmount(total);
      } catch (error) {
        console.log("Error in get cart items: ", error);
      }
    }
    fetchCartItem();
  }, []);

  // Function to update total amount from CartItem
  const updateTotalAmount = (amountChange) => {
    console.log("Amount Change: ", amountChange);
    setTotalAmount((prevAmount) => prevAmount + amountChange);
  };

  const handleCheckOut = async (e) => {
    e.preventDefault();
    console.log("Checkout Clicked");
    console.log("cart: ", cart);
    const data = {
      userId: user.id,
      cartItems: cart,
      totalAmount: totalAmount,
      quantity: productQuantity,
      email: user.email,
    };
    console.log("data: ", data);
    console.log("quantity: ", productQuantity);
    try {
      const response = await initiatePayment(
        "POST",
        { data: data },
        token,
        navigate,
        dispatch
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      console.log("Payment Initiated Successfully" + response.data);
      console.log("Payment Initiated Successfully" + JSON.stringify(response));
      console.log(
        "Payment Initiated Successfully" + JSON.stringify(response.data)
      );
    } catch (error) {
      console.log("Error in checkout: ", error);
    }
  };

  return (
    <div className="flex w-full justify-center items-center">
      {cart.length > 0 ? (
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-center">
          <div className="w-[100%] md:w-[60%] flex flex-col p-2">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                updateTotalAmount={updateTotalAmount}
                productQuantity={productQuantity}
                setProductQuantity={setProductQuantity}
              />
            ))}
          </div>

          <div className="w-[100%] md:w-[40%] mt-5 flex flex-col">
            <div className="flex flex-col h-[100%] gap-y-4">
              <p className="font-semibold text-xl text-green-400">Your Cart</p>
              <p className="font-semibold text-4xl text-green-600 uppercase">
                Summary
              </p>
              <p className="text-xl">
                <span className="text-gray-700 font-semibold text-xl">
                  Total Items: {cart.length}
                </span>
              </p>
            </div>

            <div className="flex flex-col">
              <p className="text-xl font-bold">
                Total Amount: ₹{totalAmount.toFixed(2)}
              </p>
              <button
                onClick={handleCheckOut}
                className="bg-green-700 hover:bg-purple-50 rounded-lg cursor-pointer 
                text-white transition duration-300 ease-linear mt-5 border w-48
                border-green-600 hover:text-green-700 px-2 py-1 text-xl mb-5"
              >
                Checkout Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-xl font-semibold text-blue-400">Cart Is Empty</h1>
          <NavLink to="/">
            <button
              className="bg-green-700 hover:bg-purple-50 rounded-lg 
                text-white transition duration-300 ease-linear mt-5 border
                border-green-400 text-md hover:text-green-700 px-2 py-1"
            >
              Shop Now
            </button>
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default CartPage;
