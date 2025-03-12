import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ User Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password , mobile, profile} = req.body;
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, mobile, profile });
    await newUser.save();
    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }

});

// ✅ User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "User Login Successfully", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Update Profile (Protected)
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { name, email, password, mobile, profile } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (mobile) user.mobile = mobile;
    if (profile) user.profile = profile;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Delete User (Protected)
router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get User Profile (Protected)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Password hide कर रहे हैं
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


export default router;
