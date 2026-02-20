// src/pages/Admin/ViewOrders.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://monarch-app.duckdns.org/admin/orders/users/"
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update Status
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `http://monarch-app.duckdns.org/admin/orders/update/${orderId}/`,
        {
          payment_status: newStatus,
        }
      );

      // 🔥 Refresh orders after update
      fetchOrders();

    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // ✅ Status Color Helper
  const getStatusStyle = (status) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      case "CANCELLED":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 mb-6 shadow-sm"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">
                Order #{order.id}
              </h2>

              <span
                className={`px-3 py-1 rounded text-sm font-medium ${getStatusStyle(
                  order.payment_status
                )}`}
              >
                {order.payment_status}
              </span>
            </div>

            {/* ✅ Status Dropdown */}
            <div className="mb-3">
              <select
                value={order.payment_status}
                onChange={(e) =>
                  updateStatus(order.id, e.target.value)
                }
                className="border px-3 py-1 rounded"
              >
                <option value="PENDING">PENDING</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="FAILED">FAILED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            {/* Order Details */}
            <div className="space-y-1 text-gray-700">
              <p>
                <strong>User ID:</strong> {order.user}
              </p>
              <p>
                <strong>Address:</strong> {order.address}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹
                {Number(order.total_amount).toLocaleString("en-IN")}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            {/* Razorpay Info */}
            <div className="mt-3 bg-gray-50 p-3 rounded text-sm">
              <p>
                <strong>Razorpay Order ID:</strong>{" "}
                {order.razorpay_order_id}
              </p>
              <p>
                <strong>Payment ID:</strong>{" "}
                {order.razorpay_payment_id}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}
