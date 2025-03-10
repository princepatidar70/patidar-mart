import express from "express";
import SubCategory from "../models/SubCategory.js";
import Category from "../models/Category.js";

const router = express.Router();

// ✅ Create SubCategory
router.post("/create", async (req, res) => {
  try {
    const { name, description, image, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: "Name and category are required" });
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const newSubCategory = new SubCategory({ name, description, image, category });
    await newSubCategory.save();

    res.status(201).json({ message: "SubCategory created successfully", newSubCategory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get All SubCategories
router.get("/", async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("category", "name");
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get Single SubCategory by ID
router.get("/:id", async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate("category", "name");
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Update SubCategory
router.put("/update/:id", async (req, res) => {
  try {
    const { name, description, image, category } = req.body;

    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    if (category) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    subCategory.name = name || subCategory.name;
    subCategory.description = description || subCategory.description;
    subCategory.image = image || subCategory.image;
    subCategory.category = category || subCategory.category;

    await subCategory.save();
    res.json({ message: "SubCategory updated successfully", subCategory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Delete SubCategory
router.delete("/delete/:id", async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    await subCategory.deleteOne();
    res.json({ message: "SubCategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
