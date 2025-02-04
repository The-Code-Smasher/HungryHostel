import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            minLength: 3,
            lowercase: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["breakfast", "lunch", "dinner", "snacks"],
        },
        price: {
            type: Number,
            required: true,
            min: 0,
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