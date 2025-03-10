import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./config/db.js"; 
import authRoutes from "./routes/authRoutes.js";
import category from "./routes/category.js";
import subCategory from "./routes/subCategory.js";
import product from "./routes/products.js";
import orders from "./routes/orders.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth/categories", category);
app.use("/api/subcategories", subCategory);
app.use("/api/products", product);
app.use("/api/orders", orders);
const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

// Server Listening
app.listen(PORT, () => {
  console.log(`Grocery App running successfully on port ${PORT}`);
});
