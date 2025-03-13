import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, async (req, res) => {
    try {

        const totalSales = await Order.aggregate([
            { $match: { status: "Delivered" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalCategories = await Category.countDocuments();

        res.json({
            totalSales: totalSales.length > 0 ? totalSales[0].total : 0,
            totalOrders,
            totalUsers,
            totalProducts,
            totalCategories
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get Recent Orders
router.get("/recent-orders", authMiddleware, async (req, res) => {
    try {
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name");

        const formattedOrders = recentOrders.map((order) => ({
            id: `#${order._id.toString().slice(-4)}`,
            customer: order.user ? order.user.name : "Unknown",
            amount: `₹${order.totalAmount}`,
            status: order.status,
        }));

        res.json(formattedOrders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
export default router;
