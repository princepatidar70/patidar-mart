import express from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//  Image Upload Setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

//  Create Product 
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, stock, category, subCategory } = req.body;
    const image = req.file ? req.file.filename : null;

    const existingCategory = await Category.findById(category);
    if (!existingCategory) return res.status(404).json({ message: "Category not found" });

    const existingSubCategory = await SubCategory.findById(subCategory);
    if (!existingSubCategory) return res.status(404).json({ message: "SubCategory not found" });

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

    res.status(201).json({
      message: "Product created successfully",
      product: {
        _id: newProduct._id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        stock: newProduct.stock,
        image: newProduct.image,
        category: { _id: existingCategory._id, name: existingCategory.name },
        subCategory: { _id: existingSubCategory._id, name: existingSubCategory.name },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("subCategory", "name");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  Get Single Product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("subCategory", "name");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//  Update Product
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, stock, category, subCategory } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Category Validation
    if (category) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) return res.status(404).json({ message: "Category not found" });
      product.category = category;
    }

    // SubCategory Validation
    if (subCategory) {
      const existingSubCategory = await SubCategory.findById(subCategory);
      if (!existingSubCategory) return res.status(404).json({ message: "SubCategory not found" });
      product.subCategory = subCategory;
    }

    // Updating Fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    if (image) product.image = image; // Update only if new image is uploaded

    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


//  Delete Product
router.delete("/delete/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
