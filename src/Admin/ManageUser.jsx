
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ManageUser() {
  const navigate=useNavigate();
  
  const [users, setUsers] = useState([]);
  const token=localStorage.getItem("token");
  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://127.0.0.1:8000/api/admin/usermanage/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users:", err));
  };
  const EditUser = (id) => {
    navigate(`/admin/user/edit/${id}`);
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
   <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Role</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-100">
                <td className="text-left py-3 px-4">{user.username}</td>
  <td className="text-left py-3 px-4">{user.email}</td>
                <td className="text-left py-3 px-4">
     <span
  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_staff === true
        ? "bg-green-200 text-green-800"
                        : "bg-blue-200 text-blue-800"
                    }`}
                  >
                    {user.is_staff==true ? "Admin" : "User"}
                  </span>
                </td>
                <td className="text-left py-3 px-4">
                  <button className="text-blue-500 hover:text-blue-700 mr-4" onClick={()=>EditUser(user.id)}>
                    <Edit size={18} />
                  </button>
    
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No users found.</p>
        )}
      </div>
    </div>
  );
}
