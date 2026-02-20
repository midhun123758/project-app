// src/pages/OrderHistory/OrderHistory.jsx

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function OrderHistory() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchOrders = async () => {
      try {
        if (!user) {
          navigate("/login");
          return;
        }

        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://monarch-app.duckdns.org/orders/order-history/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(response.data);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();

  }, [user, navigate]);

  // ✅ Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "text-green-600 bg-green-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "FAILED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-lg font-semibold">
        Loading your order history...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] text-lg font-semibold text-gray-600">
        <p className="mb-4">You have no orders yet.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition duration-200"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          My Orders
        </h1>

        <div className="space-y-6">

          {orders.map((order) => {

            const orderTotal = order.items.reduce(
              (sum, item) => sum + item.quantity * Number(item.price),
              0
            );

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
              >

                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end mt-2 sm:mt-0">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.payment_status)}`}
                      >
                        {order.payment_status}
                      </span>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        ₹{orderTotal.toLocaleString("en-IN")}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Items */}
                <div className="p-6">

                  <h4 className="text-md font-semibold text-gray-700 mb-4">
                    Items ({order.items.length})
                  </h4>

                  <div className="space-y-4">

                    {order.items.map((item, index) => {

                      const itemSubtotal =
                        item.quantity * Number(item.price);

                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4"
                        >

                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-20 h-20 object-cover rounded-md"
                          />

                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800">
                              {item.product_name}
                            </h5>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              Price: ₹{Number(item.price).toLocaleString("en-IN")}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-gray-800">
                              ₹{itemSubtotal.toLocaleString("en-IN")}
                            </p>
                          </div>

                        </div>
                      );
                    })}

                  </div>

                  {/* Address */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">
                        Shipping Address:
                      </span>{" "}
                      {order.address}
                    </p>
                  </div>

                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
