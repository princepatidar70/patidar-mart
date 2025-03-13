import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//  Admin Signup
router.post("/signup", async (req, res) => {
    const { name, email, password, role, profileImage } = req.body;
    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
            role,
            profileImage
        });

        await newAdmin.save();
        res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
    } catch (error) {
        res.status(500).json({ message: "Error creating admin", error });
    }
});

// Admin Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { adminId: admin._id, role: admin.role },
            process.env.JWT_SECRET || "fallback_secret",
            { expiresIn: "3h" }
        );

        res.status(200).json({ message: "Admin Login successfully", token, admin });

    } catch (error) {
        console.error("Login Error:", error);  // Log the full error
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});


//  Get All Admins
router.get("/", authMiddleware, async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: "Error fetching admins", error });
    }
});

//  Get Single Admin by ID
router.get("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: "Error fetching admin", error });
    }
});

//  Update Admin
router.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role, profileImage } = req.body;

    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const updatedAdmin = await Admin.findByIdAndUpdate(id, {
            name,
            email,
            password: hashedPassword,
            role,
            profileImage
        }, { new: true });

        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({ message: "Admin updated successfully", updatedAdmin });

    } catch (error) {
        res.status(500).json({ message: "Error updating admin", error });
    }
});

//  Delete Admin
router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAdmin = await Admin.findByIdAndDelete(id);

        if (!deletedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({ message: "Admin deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting admin", error });
    }
});

export default router;
