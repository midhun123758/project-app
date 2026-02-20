
import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
export default function DressCollection() {
  const [dresses, setDresses] = useState([]);
  const [selected, setSelected] = useState(null); 
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useContext(CartContext);
 const nav=useNavigate()
 window.scrollTo({ top: 0, behavior: "smooth" });
 useEffect(() => {
      axios 
      .get("http://monarch-app.duckdns.org/products/")
      .then((res) => {
      const filtered = res.data.filter(
        (d) => Number(d.category) === 1
      );
     setDresses(filtered)
    })
     
      .catch((err) => console.error("Error fetching dresses:", err));
     
     
  }, []);
 console.log('shirts',dresses)
  return (
  

    <div className="bg-gray-50 min-h-screen p-6">
      <div className="bg-white w-full h-[30px]"></div>
  <h1 className="text-3xl font-bold mb-8 font-bold text-center text-black">SHIRTS</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dresses.length === 0 && (
          <p className="col-span-full text-center text-gray-600">
    Loading dresses…
          </p>
        )}
        {dresses.map((dress) => (
          <HoverImageCard
   key={dress.id}
    dress={dress}
 onQuickView={() => setSelected(dress)}
 addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}

function HoverImageCard({ dress, onQuickView, addToCart }) {
  const [hovered, setHovered] = useState(false);
  const nav=useNavigate()
  const {   wishlist, toggleWishlist } = useContext(WishlistContext);
const inWishlist = Array.isArray(wishlist)
    ? wishlist.some((item) => item.id === dress.id)
 : false;
  return (
    <div
      className="relative overflow-hidden shadow-md cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h3 className="text-black items-center">
       <b>{dress.name}</b> <p></p>  {dress.price} RS
     
 </h3>
      <div className="group overflow-hidden">
  <img
   onClick={() => nav("/product", { state: { product: dress } })}
    src={hovered ? dress.img2 : dress.img1}
    alt={dress.name}
    className="w-full h-[50vh] sm:h-[70vh] object-cover transition-transform duration-500 group-hover:scale-110"
    
  />
</div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            addToCart(dress.id);
            alert(`${dress.name} added to cart!`);
          }}
          className="px-3 bg-white py-1 text-black text-sm hover:bg-blue-600/90 font-bold rounded"
        >
          Add to Cart
        </button>
        <button
  onClick={() => nav("/product", { state: { product: dress } })}
  className="px-3 py-1 bg-white text-black text-sm hover:bg-green-600/90 rounded"
>
  View Details
</button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(dress);
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
