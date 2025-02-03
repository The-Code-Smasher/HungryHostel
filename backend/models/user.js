import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        trim: true,
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        minLength: 10,
    },
    mobile: { 
        type: String, 
        required: true, 
        minLength: 10,
        unique: true,
    },
    password: { 
        type: String, 
        required: true,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    orders: [
        {
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
            orderStatus: {
                type: String,
                default: "Pending",
            },
            totalAmount: {
                type: Number,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
