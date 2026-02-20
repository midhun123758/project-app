import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SearchPanel({ onClose }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]); // always an array
  const [hoveredId, setHoveredId] = useState(null);
  const [sortOption, setSortOption] = useState("default");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch products from backend API
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (query) params.append("search", query);
      if (sortOption && sortOption !== "default") params.append("sort", sortOption);

      // Replace with your backend API URL
      const res = await axios.get(`http://monarch-app.duckdns.org/products/filter/?${params.toString()}`);

      // Make sure the response is always an array
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else if (res.data.products && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to load products:", err);
      setProducts([]); // fallback to empty array
      setLoading(false);
    }
  };

  // Fetch products when query or sort changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [query, sortOption]);

  return (
    <>
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Search panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[600px] bg-white z-50 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Search Items</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        {/* Sort */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border px-4 py-2 mb-4 w-[200px] text-black"
        >
          <option value="default">Sort by</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
          <option value="demand">Stock Based</option>
        </select>

        {/* Search input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Product list */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="cursor-pointer hover:bg-gray-100 text-black p-2 rounded"
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <img
                  onClick={() => navigate("/product", { state: { product: p } })}
                  src={hoveredId === p.id && p.img2 ? p.img2 : p.img1 || "/placeholder.png"}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded mb-2"
                />
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-gray-600">₹{p.price}</p>
                <p className="text-gray-600">Stock: {p.stock}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 col-span-2">
            {query ? "No products found" : "Type to search products..."}
          </p>
        )}
      </div>
    </>
  );
}
