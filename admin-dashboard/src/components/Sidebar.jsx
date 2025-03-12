import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); 
    navigate("/login"); 
  };

  return (
    <div className="sidebar">
      <h2 style={{ color: "black", marginLeft: "30px" }}>Admin Panel</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/dashboard/categories">Categories</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/users">Users</Link></li>
      </ul>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Sidebar;
