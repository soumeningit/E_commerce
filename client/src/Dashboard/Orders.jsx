import React, { useEffect, useState } from "react";
import { getAllOrdersForUserAPI } from "../Service/Operations/OrderAPI";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const { user, token } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const getAllOrders = async () => {
    try {
      const response = await getAllOrdersForUserAPI(
        "GET",
        { userId: user.id },
        token
      );
      if (response.status === 200) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order, index) => (
            <div
              key={index}
              onClick={() => {
                navigate(
                  `/order-details/${order.order_id}/${order.product_id}`,
                  {
                    state: {
                      order_id: order.order_id,
                      product_id: order.product_id,
                    },
                  }
                );
              }}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row cursor-pointer hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={order.product_image}
                alt={order.product_name}
                className="w-full md:w-48 h-48 object-cover"
              />
              <div className="p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">
                    {order.product_name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {order.medium_desc}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Order ID:</span>{" "}
                    {order.order_id}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Payment ID:</span>{" "}
                    {order.online_payment_id}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Completed:</span>{" "}
                    {new Date(order.order_completion_time).toLocaleString()}
                  </p>
                </div>
                <div className="mt-3">
                  <span className="text-lg font-semibold text-green-600">
                    ₹ {order.product_mrp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
