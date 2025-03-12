import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", image: "" });
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/categories");
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

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategory.name.trim() === "") return;
    
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/categories/create", newCategory);
      setCategories([...categories, response.data.category]);
      setNewCategory({ name: "", image: "" });
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
          <button className="add-category-btn" onClick={() => setShowForm(true)}>
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
                  type="text"
                  name="image"
                  placeholder="Enter Image URL"
                  value={newCategory.image}
                  onChange={handleInputChange}
                />
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Category Table */}
        <div className="category-list">
          <table>
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>Category Name</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  {/* <td>{category._id}</td> */}
                  <td>{category.name}</td>
                  <td>
                    {category.image ? (
                      <img src={category.image} alt={category.name} width="50" height="50" />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(category._id)}>
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