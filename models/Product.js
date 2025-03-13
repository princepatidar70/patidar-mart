import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },
});

export default mongoose.model("Product", productSchema);
