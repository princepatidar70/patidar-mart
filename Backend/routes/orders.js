import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import authMiddleware, { userAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

//  Create Order

router.post("/create", userAuthMiddleware, async (req, res) => {
  try {
    const { products, address } = req.body;

    if (!products || products.length === 0 || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let totalAmount = 0;
    let productUpdates = [];

    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.product} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available stock: ${product.stock}`
        });
      }

      totalAmount += product.price * item.quantity;
      productUpdates.push({ product, quantity: item.quantity });
    }

    const newOrder = new Order({
      user: req.user._id,
      products,
      totalAmount,
      address,
    });

    await newOrder.save();

    //  Reduce Stock After Order Placement
    for (const item of productUpdates) {
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    res.status(201).json({ message: "Order placed successfully", newOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});




// Get All Orders (Admin)
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

//  Get User's Orders
router.get("/my-orders", userAuthMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//  Get Single Order by ID
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

//  Update Order Status (Admin & Stock Adjustment)
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id).populate("products.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let updatedFields = {};
    if (status) updatedFields.status = status;
    if (paymentStatus) updatedFields.paymentStatus = paymentStatus;

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "No updates provided" });
    }

    //  If Order is Cancelled, Add Stock Back
    if (status === "Cancelled") {
      for (const item of order.products) {
        const product = item.product;
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    //  Update the order status/paymentStatus
    Object.assign(order, updatedFields);
    await order.save();

    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//  Delete Order (User or Admin) & Restore Stock
router.delete("/delete/:id", userAuthMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("products.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    //  Restore stock when order is deleted
    for (const item of order.products) {
      const product = item.product;
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    await order.deleteOne();
    res.json({ message: "Order deleted successfully & stock restored" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


export default router;
