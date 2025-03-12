import express from "express";
import Category from "../models/Category.js";
import authMiddleware, { adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ CREATE CATEGORY (Admins Only)
router.post("/create", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({ name, description, image });
    await newCategory.save();

    res.status(201).json({ message: "Category created successfully", category: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ GET ALL CATEGORIES (Anyone Can Access)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ GET CATEGORY BY ID (Anyone Can Access)
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ UPDATE CATEGORY (Admins Only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { name, description, image }, { new: true });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ DELETE CATEGORY (Admins Only)
router.delete("/:id",  async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
