import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ManageProduct() {
  const [products, setProducts] = useState([]);
  const  [add , setAdd] = useState([]);
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/admin/products/add");
  };

 
  const   handleEditProduct  = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };



const handleDelete = async (id) => {
  try {
    const response = await axios.patch(
      `http://127.0.0.1:8000/api/admin/productsDelete/${id}/`
    );

    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.is_deleted== true)
    );

    alert(response.data.message || "Product deleted successfully!");
  } catch (error) {
    console.error("Failed to delete product:", error.response?.data || error);
    alert("Error deleting product!");
  }
};


console.log('product',products)
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/admin/productView/")
      .then((res) => {
      // const filteredProducts = res.data.filter(
      //   (product) => product.is_deleted === trufalse
      // );
      // setProducts(filteredProducts);
      setProducts(res.data)
    })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);
 
 console.log(products)
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          onClick={handleAddProduct}
        >
          <PlusCircle size={18} className="mr-2" />
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No products added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-20 py-3 px-4 uppercase font-semibold text-sm">
                  Image
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Name
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Category
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Price
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Actions
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Stock
               </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="text-left py-3 px-4 font-medium">
                    {product.name}
                  </td>
                  <td className="text-left py-3 px-4">
                    {product.category || "—"}
                  </td>
                  <td className="text-left py-3 px-4">₹{product.price}</td>
                  <td className="text-left py-3 px-4">{product.stock}</td>
                  <td className="text-left py-3 px-4">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-4"
                      onClick={() => handleEditProduct(product.id)} 
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(product.id)}
>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
