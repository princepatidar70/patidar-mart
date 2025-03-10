import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create Order
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { products, totalAmount, address } = req.body;

    if (!products || products.length === 0 || !totalAmount || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate Products
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.product} not found` });
      }
    }

    const newOrder = new Order({
      user: req.user.userId,
      products,
      totalAmount,
      address,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", newOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get All Orders (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get User's Orders
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get Single Order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("products.product", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Update Order Status (Admin)
router.put("/update/:id", async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Delete Order (Admin)
router.delete("/delete/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
