import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./config/db.js"; 
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/category.js";
import subCategoryRoutes from "./routes/subCategory.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);  // Fixed route path
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Database Connection
connectDB();

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Grocery App running successfully on port ${PORT}`);
});
