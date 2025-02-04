import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    items: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Product", 
                required: true 
            },
            quantity: { 
                type: Number, 
                required: true 
            },
            price: { 
                type: Number, 
                required: true 
            },
        },
    ],
    totalAmount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        default: "Pending" 
    },
    createdAt: { 
        type: Date, 
        immutable: true,
        default: () => Date.now(),
    },
    paymentStatus: { 
        type: String, 
        default: "Unpaid" 
    },
    shippingAddress: { 
        type: String, 
        required: true 
    },
});

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;
