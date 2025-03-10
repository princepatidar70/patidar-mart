import express from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";

const router = express.Router();

// ✅ Create Product
router.post("/create", async (req, res) => {
  try {
    const { name, description, price, stock, image, category, subCategory } = req.body;

    if (!name || !price || !stock || !category || !subCategory) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const existingSubCategory = await SubCategory.findById(subCategory);
    if (!existingSubCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      image,
      category,
      subCategory,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", newProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("subCategory", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get Single Product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("subCategory", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Update Product
router.put("/update/:id", async (req, res) => {
  try {
    const { name, description, price, stock, image, category, subCategory } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (category) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    if (subCategory) {
      const existingSubCategory = await SubCategory.findById(subCategory);
      if (!existingSubCategory) {
        return res.status(404).json({ message: "SubCategory not found" });
      }
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.image = image || product.image;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;

    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Delete Product
router.delete("/delete/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
