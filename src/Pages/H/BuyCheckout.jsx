// src/pages/Checkout/Checkout.jsx

import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const navigate = useNavigate();
  const location = useLocation();

  const singleProduct = location.state?.product;

  const getInitialItems = () => {
    if (singleProduct) return [{ ...singleProduct, quantity: 1 }];
    return cart.map(item => ({
      ...item,
      quantity: item.quantity ?? 1
    }));
  };

  const [items, setItems] = useState(getInitialItems());
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  useEffect(() => {
    if (!user) {
      toast.error("Please login first!");
      navigate("/login");
    }
  }, [user, navigate]);

  const subtotal = items.reduce(
    (sum, item) =>
      sum + (Number(item.product_price || item.price) || 0) * item.quantity,
    0
  );

  const validateOrder = () => {
    if (!address || address.trim().length < 5) {
      toast.warning("Please enter a valid address!");
      return false;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return false;
    }

    return true;
  };

  const placeOrder = async () => {
    const toastId = toast.loading("Creating order...");

    try {
      if (!validateOrder()) {
        toast.dismiss(toastId);
        return;
      }

      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.update(toastId, {
          render: "Authentication required!",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }

      const orderItems = items.map(item => ({
        product: item.product || item.id,
        quantity: item.quantity,
      }));

      const orderData = {
        items: orderItems,
        address: address.trim(),
        payment_method: paymentMethod,
      };

      const { data } = await axios.post(
        "https://monarch-app.ddns.net/api/orders/orders/",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ COD SUCCESS
      if (paymentMethod === "cod") {
        toast.update(toastId, {
          render: "Order placed successfully (COD)!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate("/success", { state: { total: subtotal } });
        }, 2000);

        return;
      }

      // 💳 Razorpay
      toast.update(toastId, {
        render: "Opening payment gateway...",
        type: "info",
        isLoading: false,
        autoClose: 2000,
      });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "My Shop",
        order_id: data.razorpay_order_id,

        handler: async function (response) {
          const verifyToast = toast.loading("Verifying payment...");

          try {
            await axios.post(
              "https://monarch-app.ddns.net/api/orders/verify-payment/",
              {
                db_order_id: data.db_order_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            toast.update(verifyToast, {
              render: "Payment successful!",
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });

            setTimeout(() => {
              navigate("/success", { state: { total: subtotal } });
            }, 2000);

          } catch (err) {
            toast.update(verifyToast, {
              render: "Payment verification failed!",
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
          }
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled!");
          },
        },

        prefill: {
          name: user?.username || "",
        },

        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);

      toast.update(toastId, {
        render: "Something went wrong!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-3">Shipping Address</h2>

          <textarea
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full border p-3 rounded mb-4"
            rows={4}
            placeholder="Enter full address"
          />

          <h2 className="font-semibold mb-2">Payment Method</h2>

          <div className="flex gap-4 mb-4">
            <label>
              <input
                type="radio"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={() => setPaymentMethod("razorpay")}
                className="mr-2"
              />
              Pay Online
            </label>

            <label>
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="mr-2"
              />
              Cash on Delivery
            </label>
          </div>

          <p className="font-bold mb-3">
            Total: ₹{subtotal.toLocaleString("en-IN")}
          </p>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded disabled:bg-gray-400"
          >
            {loading
              ? "Processing..."
              : paymentMethod === "cod"
              ? "Place Order (COD)"
              : "Pay with Razorpay"}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Order Summary</h2>

          {items.map(item => (
            <div key={item.id} className="flex justify-between border-b py-3">
              <div className="flex gap-3">
                <img
                  src={item.product_img1 || item.img2 || item.img1}
                  alt=""
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">
                    {item.product_name || item.name}
                  </p>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>

              <p className="font-semibold">
                ₹{(
                  (Number(item.product_price || item.price) || 0) *
                  item.quantity
                ).toLocaleString("en-IN")}
              </p>
            </div>
          ))}

          <div className="mt-4 font-bold text-lg">
            Total: ₹{subtotal.toLocaleString("en-IN")}
          </div>
        </div>
      </div>
    </div>
  );
}
