import React, { useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { useContext } from "react";
import { WishlistContext } from "../../context/WishContext"; // make sure you created WishContext.js
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios"
export default function DressCollection() {
  const [dresses, setDresses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // You can change this to 6, 12, etc.

  const totalPages = Math.ceil(dresses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDresses = dresses.slice(startIndex, startIndex + itemsPerPage);

  const { addToCart } = useContext(CartContext);
useEffect(() => {
  axios
    .get("https://monarch-app.ddns.net/api/products/")
    .then((res) => {
      const filteredDresses = res.data.filter(
        (item) => item.is_deleted === false
      );
      setDresses(filteredDresses);
    })
    .catch((err) => console.error("Error fetching dresses:", err));
}, []);
console.log(dresses);
  return (
    <div>
      <section className="relative w-full h-[80vh] md:h-[fullvh] overflow-hidden ">
        <img
          src="/assets/green.jpg" // Make sure this image is in your public folder
          alt="Tech Lifestyle Banner"
          className="object-cover w-full h-full "
        />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent flex flex-col items-center justify-center text-center px-4 space-y-6">
  <h1
    style={{ fontFamily: '"Great Vibes", cursive' }}
    className="tracking-wide text-7xl md:text-7xl text-white drop-shadow-2xl"
  >
    More Than a Dream
  </h1>
</div>

      </section>

      <div className="bg-gray-50 min-h-screen p-6 ">
        <h1 className="text-3xl font-bold  mb-8">Explore</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
          {dresses.length === 0 && (
            <p className="col-span-full text-center text-gray-600">
              Loading dresses…
            </p>
          )}

          {currentDresses.map((dress) => (
            <HoverImageCard key={dress.id} dress={dress} addToCart={addToCart} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-8 space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1 ? 'bg-black text-white' : 'bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
function HoverImageCard({ dress, addToCart, onQuickView }) {
  const nav = useNavigate();
  const [hovered, setHovered] = useState(false);

  const { wishlist, addToWishlist } = useContext(WishlistContext);

  // Filter only actual wishlist items with id
  const validWishlist = Array.isArray(wishlist)
    ? wishlist.filter((item) => item.id)
    : [];

  // Check if this dress is in wishlist
  const inWishlist = validWishlist.some((item) => item.product === dress.id);

  const handleAddToCart = () => {
    addToCart(dress.id, 1);
    toast.success(`${dress.name} added to cart!`);
  };

  return (
    <div
      className="relative overflow-hidden shadow-md "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h3 className="text-black items-center">
        {dress.name} <b>"{dress.price}RS"</b>
      </h3>

      {/* Image */}
      <div className="group overflow-hidden">
        <img
          onClick={() => nav("/product", { state: { product: dress } })}
          src={hovered ? dress.img2 : dress.img1}
          alt={dress.name}
          className="w-full h-[70vh] object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="mt-4 flex space-x-4 ">
        <button
          className="px-3 bg-white py-1 text-black text-sm hover:bg-blue-600/90 font-bold rounded "
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

        <button
          className="px-3 py-1 bg-white text-black text-sm hover:bg-green-600/90 rounded"
          onClick={() => nav("/product", { state: { product: dress } })}
        >
          checkout
        </button>

        {/* Wishlist Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToWishlist(dress.id);
          }}
          className={`px-3 py-2 rounded text-sm transition-all ${
            inWishlist ? "bg-pink-500 text-white" : "bg-white"
          }`}
          aria-pressed={inWishlist}
        >
          {inWishlist ? "♥" : "♡"}
        </button>
      </div>
    </div>
  );
}
