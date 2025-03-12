import React from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  // Dummy stats
  const stats = {
    totalSales: "$12,450",
    totalOrders: 128,
    totalUsers: 560,
    totalProducts: 75,
  };

  const recentOrders = [
    { id: "#1001", customer: "John Doe", amount: "$120", status: "Delivered" },
    { id: "#1002", customer: "Jane Smith", amount: "$85", status: "Pending" },
    {
      id: "#1003",
      customer: "Mike Johnson",
      amount: "$200",
      status: "Cancelled",
    },
    { id: "#1004", customer: "Emily Davis", amount: "$150", status: "Shipped" },
  ];

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      <Sidebar onLogout={handleLogout} />
      <div className="dashboard-content">
        <header>
          <h2>Admin Dashboard</h2>
        </header>

        {/* Dashboard Stats */}
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
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        {/* Recent Orders */}
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
      </div>
    </div>
  );
};

export default Dashboard;
