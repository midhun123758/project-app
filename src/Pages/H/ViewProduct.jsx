// src/pages/Product/ViewProduct.jsx

import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishContext";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import axios from "axios";

export default function ViewProduct() {
  const [imageIndex, setImageIndex] = useState(0);
  const [additional, setAdditional] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);
  const { wishlist, addToWishlist } = useContext(WishlistContext);

  const product = location.state?.product;

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // If no product
  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Product not found. Go back to{" "}
        <span
          className="text-blue-600 cursor-pointer ml-1"
          onClick={() => navigate(-1)}
        >
          Explore
        </span>
      </div>
    );
  }

  // Reset image index if product changes
  useEffect(() => {
    setImageIndex(0);
  }, [product]);

  // Safe images
  const images = [
    product.img1,
    product.img2,
    product.img3,
    product.img4,
  ].filter(Boolean);

  // Fetch related products (FIXED)
  useEffect(() => {

    axios
      .get(
        `https://monarch-app.ddns.net/api/products/details/${product.id}/`,
  
      )
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAdditional(
            res.data.filter(
              (item) =>
                item.category === product.category &&
                item.id !== product.id
            )
          );
        } else {
          console.warn("Unexpected related response:", res.data);
        }
      })
      .catch((err) => {
        console.error(
          "Error fetching related:",
          err.response?.data || err.message
        );
      });
  }, [product]);

  // Wishlist logic
  const validWishlist = Array.isArray(wishlist)
    ? wishlist.filter((item) => item?.product)
    : [];

  const inWishlist = validWishlist.some(
    (item) => item.product === product.id
  );

  const nextImage = () => {
    if (images.length === 0) return;
    setImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (images.length === 0) return;
    setImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row items-center justify-center p-10 gap-6">
      
      {/* Image Section */}
      <div className="flex items-center gap-4">
        <button onClick={prevImage}>
          <ArrowLeftIcon className="h-8 w-7 text-black" />
        </button>

        {images.length > 0 && (
          <img
            src={images[imageIndex]}
            alt={product.name}
            className="w-[500px] h-[650px] object-cover shadow-lg"
          />
        )}

        <button onClick={nextImage}>
          <ArrowRightIcon className="h-8 w-7 text-black" />
        </button>
      </div>

      {/* Product Info */}
      <div className="max-w-[400px]">
        <h1 className="text-4xl font-bold mb-3">
          {product.name}
        </h1>

        <p className="text-gray-700 text-xl mb-2">
          ₹{product.price}
        </p>

        <p className="text-gray-500 mb-4">
          {product.description}
        </p>

        <p className="text-gray-700 mb-6">
          Stock: {product.stock}
        </p>

        <div className="flex gap-3">
          
          {/* Buy Now */}
          <button
            onClick={() =>
              navigate("/buy", { state: { product } })
            }
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
          >
            Buy Now
          </button>

          {/* Add to Cart */}
          <button
            onClick={() => addToCart(product.id, 1)}
            className="px-4 py-2 bg-white border text-black rounded hover:bg-blue-600 hover:text-white"
          >
            Add to Cart
          </button>

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToWishlist(product.id);
            }}
            className={`px-3 py-2 rounded transition-all ${
              inWishlist
                ? "bg-pink-500 text-white"
                : "bg-white border"
            }`}
          >
            {inWishlist ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
}
