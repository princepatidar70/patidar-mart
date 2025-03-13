import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalSales: "₹0",
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const isAuth = localStorage.getItem("adminToken");
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${isAuth}` },
      });
      setStats({
        totalSales: `₹${data.totalSales}`,
        totalOrders: data.totalOrders,
        totalUsers: data.totalUsers,
        totalProducts: data.totalProducts,
        totalCategories: data.totalCategories,
      });

      const recentOrdersRes = await axios.get("http://localhost:3000/api/dashboard/recent-orders", {
        headers: { Authorization: `Bearer ${isAuth}` },
      });
      setRecentOrders(recentOrdersRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      <Sidebar onLogout={handleLogout} />
      <div className="dashboard-content">
        <header>
          <h2>Admin Dashboard</h2>
        </header>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{stats.totalSales}</h3>
            <p>Total Sales</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalCategories}</h3>
            <p>Total Categories</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : (
        <div className="recent-orders">
          <h3>Recent Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.amount}</td>
                  <td className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
