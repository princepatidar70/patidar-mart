import express from "express";
import SubCategory from "../models/SubCategory.js";
import Category from "../models/Category.js";
import multer from "multer";

const router = express.Router();

// Image Upload Setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

//  SubCategory Create API 
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, category } = req.body;
    const image = req.file ? req.file.filename : null;

    //  Validate category ID (Check if category exists)
    const parentCategory = await Category.findById(category);
    if (!parentCategory) {
      return res.status(400).json({ message: "Invalid category selected" });
    }

    const newSubCategory = new SubCategory({
      name,
      category,
      image,
    });

    await newSubCategory.save();


    res.status(201).json({
      message: "SubCategory created successfully",
      subCategory: {
        _id: newSubCategory._id,
        name: newSubCategory.name,
        category: {
          _id: parentCategory._id,
          name: parentCategory.name,
        },
        image: newSubCategory.image,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Read All
router.get("/", async (req, res) => {
  const subCategories = await SubCategory.find().populate("category", "name");
  res.status(200).json(subCategories);
});

// Update
router.put("/update/:id", upload.single("image"), async (req, res) => {
  const { name, category } = req.body;
  const image = req.file ? req.file.filename : undefined;

  const subCategory = await SubCategory.findById(req.params.id);
  if (!subCategory) return res.status(404).json({ message: "Not found" });

  subCategory.name = name || subCategory.name;
  subCategory.category = category || subCategory.category;
  if (image) subCategory.image = image;

  await subCategory.save();
  res.status(200).json({ message: "Updated", subCategory });
});

// Delete
router.delete("/delete/:id", async (req, res) => {
  await SubCategory.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Deleted" });
});

export default router;
