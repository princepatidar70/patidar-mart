import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "user",
    profile: null,
  });
  const isAuth = localStorage.getItem("adminToken");
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users");

      setUsers(response.data.user);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert(error.response?.data?.message || "Failed to fetch users");
    }
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewUser({ ...newUser, profile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.mobile) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", newUser.name);
      formData.append("email", newUser.email);
      formData.append("password", newUser.password);
      formData.append("mobile", newUser.mobile);
      formData.append("role", newUser.role);
      if (newUser.profile) formData.append("profile", newUser.profile);

      let response;
      if (editingUser) {
        response = await axios.put(
          `http://localhost:3000/api/users/${editingUser._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${isAuth}`,
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:3000/api/users/signup",
          formData
        );
      }

      fetchUsers();
      setShowForm(false);
      setEditingUser(null);
      setNewUser({
        name: "",
        email: "",
        password: "",
        mobile: "",
        role: "user",
        profile: null,
      });
    } catch (error) {
      console.error("Error saving user:", error);
      alert(error.response?.data?.message || "Failed to save user");
    }
    setLoading(false);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      password: "",
      mobile: user.mobile,
      role: user.role,
      profile: null,
    });
    setShowForm(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${isAuth}` },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <header>
          <h2>Manage Users</h2>
          <button className="save-btn" onClick={() => setShowForm(true)}>
            Add User
          </button>
        </header>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  required={!editingUser}
                />
                <input
                  type="text"
                  name="mobile"
                  placeholder="Mobile"
                  value={newUser.mobile}
                  onChange={handleInputChange}
                  required
                />
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="file"
                  name="profile"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="user-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Image</th>
                <th>Mobile</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user?.image ? (
                      <img
                        src={`http://localhost:3000/uploads/${user?.image}`}
                        alt={user?.name}
                        width="50"
                        height="50"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{user.mobile}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
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

export default Users;
