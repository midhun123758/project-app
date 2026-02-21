

import React, { useEffect, useState, useContext, use } from "react";
import { CartContext } from "../context/CartContext"
import { WishlistContext } from "../context/WishContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function Tshirts() {
  const [tshirts, setTshirts] = useState([]);
  const [selected, setSelected] = useState(null); // modal
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useContext(CartContext);
window.scrollTo({ top: 0, behavior: "smooth" });
  useEffect(() => {
    axios .get("https://monarch-app.ddns.net/api/products/")
      .then((res) => {
      const filtered = res.data.filter(
        (d) => Number(d.category) === 3
      );
     setTshirts(filtered)
  }, [])});

  return (
    <div className="bg-gray-50 min-h-screen p-6">
       <div className="bg-white w-full h-[30px]"></div>
      <h1 className="text-3xl font-bold mb-8 font-bold text-center text-black">T-SHIRTS</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tshirts.length === 0 && (
          <p className="col-span-full text-center text-gray-600">
            Loading T-shirts…
          </p>
        )}
        {tshirts.map((tshirt) => (
          <HoverImageCard
            key={tshirt.id}
            tshirt={tshirt}
            onQuickView={() => setSelected(tshirt)}
            addToCart={addToCart}
          />
        ))}
      </div>

     
    </div>
  );
}

function HoverImageCard({ tshirt, onQuickView, addToCart }) {
  const nav=useNavigate()
  const [hovered, setHovered] = useState(false);
  const { addToWishlist } = useContext(WishlistContext);
  const {wishlist,toggleWishlist}=useContext(WishlistContext)
  const inWishlist = Array.isArray(wishlist)
    ? wishlist.some((item) => item.id === tshirt.id)
    : false;
  return (
    <div
      className="relative overflow-hidden shadow-md cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h3 className="text-black items-center">
        {tshirt.name} <b>“{tshirt.price} RS”</b>
      </h3>
    <div className="group overflow-hidden">
  <img
   onClick={() => nav("/product", { state: { product: tshirt } })}
    src={hovered ? tshirt.img2 : tshirt.img1}
    alt={tshirt.name}
    className="w-full h-[50vh] sm:h-[70vh] object-cover transition-transform duration-500 group-hover:scale-110"
   
  />
</div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => addToCart(tshirt.id)}
          className="px-3 bg-white py-1 text-black text-sm hover:bg-blue-600/90 font-bold rounded"
        >
          Add to Cart
        </button>
        <button
          onClick={() => nav("/product", { state: { product: tshirt} })}
          className="px-3 py-1 bg-white text-black text-sm hover:bg-green-600/90 rounded"
        >
          View Details
        </button>
          <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(tshirt);
          }}
          className={`px-3 py-2 rounded text-sm transition-all ${
            inWishlist ? "bg-pink-500 text-white" : "bg-white "
          }`}
          aria-pressed={inWishlist}
        >
          {inWishlist ? "♥" : "♡"}
        </button>
      </div>
    </div>
  );
}  