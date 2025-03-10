import express from "express";
import Category from "../models/Category.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create Category
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const newCategory = new Category({ name, description, image });
    await newCategory.save();

    res.status(201).json({ message: "Category created successfully", newCategory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get All Categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get Category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Update Category
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { name, description, image }, { new: true });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Delete Category
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
