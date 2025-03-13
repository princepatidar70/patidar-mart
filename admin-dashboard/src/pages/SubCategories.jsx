import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const SubCategories = () => {
  const [subcategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    image: null,
    category: "",
  });
  const [loading, setLoading] = useState(false);

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

    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/subcategories"
        );
        setSubCategories(response.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchCategories();
    fetchSubCategories();
  }, []);

  const handleInputChange = (e) => {
    setNewSubCategory({ ...newSubCategory, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewSubCategory({ ...newSubCategory, image: e.target.files[0] });
  };

  const handleAddSubCategory = async (e) => {
    e.preventDefault();

    if (
      !newSubCategory.name.trim() ||
      !newSubCategory.category ||
      !newSubCategory.image
    ) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", newSubCategory.name);
    formData.append("category", newSubCategory.category);
    formData.append("image", newSubCategory.image);

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/subcategories/create",
        formData
      );
      setSubCategories([...subcategories, response.data.subCategory]);
      console.log("sub", response.data.subCategory);

      setNewSubCategory({ name: "", image: null, category: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding subcategory:", error);
      alert(error.response?.data?.message || "Failed to add subcategory");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/subcategories/delete/${id}`
      );
      setSubCategories(subcategories.filter((cat) => cat._id !== id));
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <header>
          <h2>Manage Sub Categories</h2>
          <button className="save-btn" onClick={() => setShowForm(true)}>
            Add SubCategory
          </button>
        </header>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add New Subcategory</h3>
              <form onSubmit={handleAddSubCategory}>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter SubCategory Name"
                  value={newSubCategory.name}
                  onChange={handleInputChange}
                  required
                />

                <select
                  name="category"
                  value={newSubCategory.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

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
                <th>Parent Category</th>
                <th>SubCategory Name</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subcategories.map((subcategory) => (
                <tr key={subcategory._id}>
                  <td>{subcategory.category?.name || "No Category"}</td>
                  <td>{subcategory.name}</td>
                  <td>
                    {subcategory.image ? (
                      <img
                        src={`http://localhost:3000/uploads/${subcategory.image}`}
                        alt={subcategory.name}
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
                      onClick={() => handleDelete(subcategory._id)}
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

export default SubCategories;
