import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import dashboardRoutes from "./routes/dashboardRoute.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/category.js";
import subCategoryRoutes from "./routes/subCategory.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/adminRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/dashboard", dashboardRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/users", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Database Connection
connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Grocery App running successfully on port ${PORT}`);
});
