// src/Admin/Adding.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Adding() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    img1: "",
    img2: "",
    img3: "",
    img4: "",
    description: "",
    stock: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value, }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send product to backend
      await axios.post("http://monarch-app.duckdns.org/admin/productsadd/",
         {
        
        ...product,
        price: Number(product.price),
      });
      alert("Product added successfully!");
      navigate("/admin/products"); 
    } catch (err) {
      console.error("Failed to add product:", err);
      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Image URL</label>
          <input
            type="text"
            name="img1"
            value={product.img1}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
     
        <div>
          <label className="block font-medium mb-1">2 Image URL</label>
          <input
            type="text"
            name="img2"
            value={product.img2}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">3rd Image URL</label>
          <input
            type="text"
            name="img3"
            value={product.img3}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">4th Image URL</label>
          <input
            type="text"
            name="img4"
            value={product.img4}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
    <label className="block text-gray-700 font-semibold mb-2">Stock</label>
      <input
      type="number"
      name="stock"
      value={product.stock}
    onChange={handleChange}
    placeholder="Enter available stock"
    className="border rounded px-3 py-2 w-full"
  />
</div>

        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
