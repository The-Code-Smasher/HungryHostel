import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minLength: 3, // Adjusted from 10 to 3 for better usability
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Breakfast", "Lunch", "Dinner", "Snacks", "Beverages"],
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Ensures price cannot be negative
    },
    description: {
      type: String,
      required: true,
    },
    
    status: {
      type: String,
      enum: ["Available", "Out of Stock"],
      default: "Available",
    },
    images: [
      {
        type: String, // URL of the image (Cloudinary, Firebase, etc.)
      },
    ],
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;