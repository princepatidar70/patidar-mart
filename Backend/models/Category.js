import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  image: {
    type: String,
    required: false,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);
