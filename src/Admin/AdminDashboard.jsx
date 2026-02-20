import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, Package, DollarSign, ShoppingCart } from "lucide-react";

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const AdminDashboardV2 = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalSales: 0,
  });

  const [salesStatus, setSalesStatus] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get("http://monarch-app.duckdns.org/admin/usermanage/"),
          axios.get("http://monarch-app.duckdns.org/admin/productView/"),
          axios.get("http://monarch-app.duckdns.org/admin/orders/users/"),
        ]);

        const users = usersRes.data;
        const products = productsRes.data;
        const orders = ordersRes.data;

        // SUCCESS orders only
        const successOrders = orders.filter(
          (o) => o.payment_status === "SUCCESS"
        );

        // Total Revenue
        const totalRevenue = successOrders.reduce(
          (sum, order) => sum + parseFloat(order.total_amount),
          0
        );

        // Order Status Count
        const statusCount = orders.reduce((acc, order) => {
          acc[order.payment_status] =
            (acc[order.payment_status] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalUsers: users.length,
          totalProducts: products.length,
          totalRevenue,
          totalSales: orders.length,
        });

        setSalesStatus(
          Object.entries(statusCount).map(([name, value]) => ({
            name,
            value,
          }))
        );
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="text-green-800" />}
          color="bg-green-200"
        />
        <StatCard
          title="Total Sales"
          value={stats.totalSales}
          icon={<ShoppingCart className="text-blue-800" />}
          color="bg-blue-200"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="text-purple-800" />}
          color="bg-purple-200"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package className="text-orange-800" />}
          color="bg-orange-200"
        />
      </div>

      {/* Sales Status Chart */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Order Payment Status
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesStatus}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboardV2;
