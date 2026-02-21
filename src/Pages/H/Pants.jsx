import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishContext"; 
import Footer from "../../Footer/Footer";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Navigate,useNavigate } from "react-router-dom";
export default function Pants() {
  const [pantsList, setPantsList] = useState([]);
  const [selected, setSelected] = useState(null); // modal
  const { addToCart } = useContext(CartContext);
  window.scrollTo({ top: 0, behavior: "smooth" });
  useEffect(() => {
      axios 
      .get("https://monarch-app.ddns.net/api/products/")
      .then((res) => {
      const filtered = res.data.filter(
        (d) => Number(d.category) ==2
      );
     setPantsList(filtered)
    })
     
     .catch((err) => console.error("Error fetching dresses:", err));
    
     
  }, []);
console.log('pants',pantsList)
  return (
    <div className="bg-gray-50 min-h-screen p-6">
       
       <div className="bg-white w-[full] h-[30px]"></div>
      <h1 className="text-3xl font-bold mb-8 font-bold text-center text-black">PANTS</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pantsList.length === 0 && (
          <p className="col-span-full text-center text-gray-600">
            Loading pants…
          </p>
        )}

        {pantsList.map((pants) => (
          <HoverImageCard
            key={pants.id}
            pants={pants}
            addToCart={addToCart}
            onQuickView={() => setSelected(pants)}
          />
        ))}
      </div>

    </div>
  );
}

function HoverImageCard({ pants, addToCart, onQuickView }) {
  const nav=useNavigate()
  const [hovered, setHovered] = useState(false);
 const { addToWishlist } = useContext(WishlistContext);
  const {   wishlist, toggleWishlist } = useContext(WishlistContext);
  const inWishlist = Array.isArray(wishlist)
    ? wishlist.some((item) => item.id === pants.id)
    : false
  return (
    <div
      className="relative overflow-hidden shadow-md cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h3 className="text-black items-center">
        {pants.name} <b>“{pants.price} RS”</b>
      </h3>
      <div className="group overflow-hidden">
  <img
   onClick={() => nav("/product", { state: { product: pants } })}
    src={hovered ? pants.img2 : pants.img1}
    alt={pants.name}
    className="w-full h-[50vh] sm:h-[70vh] object-cover transition-transform duration-500 group-hover:scale-110"
  />
</div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            addToCart(pants.id);
            toast.success(`${pants.name} added to cart!`);
          }}
          className="px-3 bg-white py-1 text-black text-sm hover:bg-blue-600/90 font-bold rounded"
        >
          Add to Cart
        </button>
        <button
           onClick={() => nav("/product", { state: { product: pants } })}
          className="px-3 py-1 bg-white text-black text-sm hover:bg-green-600/90 rounded"
        >
          View Details
        </button>
           <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(pants);
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
