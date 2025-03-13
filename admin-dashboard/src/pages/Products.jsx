import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    category: "",
    subCategory: "",
  });
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

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchCategories();
    fetchSubCategories();
    fetchProducts();
  }, []);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setNewProduct({ ...newProduct, category: categoryId, subCategory: "" });

    const filteredSubs = subCategories.filter(
      (sub) => sub.category?._id === categoryId
    );
    setFilteredSubCategories(filteredSubs);
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.category ||
      !newProduct.subCategory ||
      !newProduct.image
    ) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      formData.append(key, newProduct[key]);
    });

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/products/create",
        formData
      );
      setProducts([...products, response.data.newProduct]);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: null,
        category: "",
        subCategory: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.message || "Failed to add product");
    }
    setLoading(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category?._id || "",
      subCategory: product.subCategory?._id || "",
      image: null,
    });
    setFilteredSubCategories(
      subCategories.filter((sub) => sub.category?._id === product.category?._id)
    );
    setShowForm(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.category ||
      !newProduct.subCategory
    ) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      if (newProduct[key]) {
        formData.append(key, newProduct[key]);
      }
    });

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/products/update/${editingProduct._id}`,
        formData
      );
      setProducts(
        products.map((product) =>
          product._id === editingProduct._id
            ? response.data.updatedProduct
            : product
        )
      );
      setEditingProduct(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.response?.data?.message || "Failed to update product");
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/products/delete/${productId}`
      );
      setProducts(products.filter((product) => product?._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <header>
          <h2>Manage Products</h2>
          <button className="save-btn" onClick={() => setShowForm(true)}>
            Add Product
          </button>
        </header>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <form
                onSubmit={
                  editingProduct ? handleUpdateProduct : handleAddProduct
                }
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                ></textarea>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  required
                />

                <select
                  name="category"
                  value={newProduct.category}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  name="subCategory"
                  value={newProduct.subCategory}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select SubCategory</option>
                  {filteredSubCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Saving..." : editingProduct ? "Update" : "Save"}
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

        <div className="product-list">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>SubCategory</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product?._id}>
                  <td>{product?.category?.name || "No Category"}</td>
                  <td>{product?.subCategory?.name || "No SubCategory"}</td>
                  <td>{product?.name}</td>
                  <td>{product?.price}</td>
                  <td>{product?.stock}</td>
                  <td>
                    {product?.image ? (
                      <img
                        src={`http://localhost:3000/uploads/${product?.image}`}
                        alt={product?.name}
                        width="50"
                        height="50"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product?._id)}
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

export default Products;
