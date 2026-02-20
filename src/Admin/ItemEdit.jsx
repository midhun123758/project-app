import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ItemEdit = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    img1: "",
    img2: "",
    description: "",
    img3: "",
    img4: "",
    stock: "",
  });

  useEffect(() => {
    axios
      .get(`http://monarch-app.duckdns.org/admin/productsingleView/${id}/`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await axios.patch(`http://monarch-app.duckdns.org/admin/productsEdit/${id}/`, product);
    alert("Product updated successfully!");
    navigate("/admin/products");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          name="img1"
          placeholder="Image URL"
          value={product.img1}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          name="img2"
          placeholder="Image URL"
          value={product.img2}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />        <input
          type="text"
          name="img3"
          placeholder="Image URL"
          value={product.img3}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
           <input
          type="text"
          name="img4"
          placeholder="Image URL"
          value={product.img4}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
            <input
          type="text"
          name="description"
          placeholder="description"
          value={product.description}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
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
<div>
  <label className="block text-gray-700 font-semibold mb-2">Is Deleted</label>
  <input
    type="text"
    name="is_deleted"
    value={product.is_deleted ? "True" : "False"}
    readOnly
    disabled
    className="border rounded px-3 py-2 w-full bg-gray-100 cursor-not-allowed"
  />
</div>


        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ItemEdit;
