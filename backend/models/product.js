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
            enum: ["breakfast", "lunch", "dinner", "snacks", "Beverages"],
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
        canteen: {
            type: String,
            required: true,
        },
        images: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;