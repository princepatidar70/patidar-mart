import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", image: null });
  const [loading, setLoading] = useState(false);
  const isAuth = localStorage.getItem("adminToken");
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewCategory({ ...newCategory, image: e.target.files[0] });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (newCategory.name.trim() === "") {
      alert("Category name is required!");
      return;
    }

    const categoryExists = categories.some(
      (category) =>
        category.name.toLowerCase() === newCategory.name.toLowerCase()
    );
    if (categoryExists) {
      alert("Category already exists!");
      return;
    }

    if (!newCategory.image) {
      alert("Please select an image!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", newCategory.name);
      formData.append("image", newCategory.image);

      const response = await axios.post(
        "http://localhost:3000/api/categories/create",
        formData,
        {
          headers: { Authorization: `Bearer ${isAuth}` },
        }
      );

      setCategories([...categories, response.data.category]);
      setNewCategory({ name: "", image: null });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding category:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/categories/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <header>
          <h2>Manage Categories</h2>
          <button className="save-btn" onClick={() => setShowForm(true)}>
            Add Category
          </button>
        </header>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add New Category</h3>
              <form onSubmit={handleAddCategory}>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Category Name"
                  value={newCategory.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
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

        <div className="category-list">
          <table>
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>
                    {category.image ? (
                      <img
                        src={`http://localhost:3000/uploads/${category.image}`}
                        alt={category.name}
                        width="50"
                        height="50"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(category._id)}
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

export default Categories;
