// src/context/WishlistContext.js
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { wishlist as wishlistAPI } from "../api/api";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext); // AuthContext should provide token & user
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  // ---------------- FETCH WISHLIST ----------------
  const fetchWishlist = useCallback(async () => {
    if (!token) return;

    try {
      const res = await wishlistAPI.getWishlist(token);
      setWishlist(res.data.wishlist_items || []);
    } catch (err) {
      console.error("Fetch wishlist error:", err.response?.data || err.message);
    }
  }, [token]);

  useEffect(() => {
    if (user) fetchWishlist();
    else setWishlist([]);
  }, [user, fetchWishlist]);

  // ---------------- TOGGLE ITEM ----------------
  const addToWishlist = async (productId) => {
    if (!token) return navigate("/user");

    try {
      const res = await wishlistAPI.addToWishlist(productId, token);

      setWishlist((prev) => {
        const exists = prev.some((item) => item.product === productId);
        if (exists) {
          return prev.filter((item) => item.product !== productId);
        }
        return [...prev, res.data];
      });

      toast.success(res.data.id ? "Added to wishlist!" : "Removed from wishlist!");
    } catch (err) {
      console.error("Toggle wishlist error:", err.response?.data || err.message);
    }
  };

  // ---------------- REMOVE ITEM ----------------
  const removeFromWishlist = async (itemId) => {
    if (!token) return;

    try {
      await wishlistAPI.removeItem(itemId, token);
      setWishlist((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("Item removed from wishlist!");
    } catch (err) {
      console.error("Remove wishlist error:", err.response?.data || err.message);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
