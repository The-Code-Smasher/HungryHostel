import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
    },
    mobile: { 
        type: String, 
        required: true, 
        minLength: 10,
    },
    address: { 
        type: String, 
        required: true, 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    password: { 
        type: String, 
        required: true,
    },
    menu: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Product", 
                required: true 
            },
            description: { 
                type: String, 
                required: true 
            },
            price: { 
                type: Number, 
                required: true 
            },
            stock: { 
                type: Number, 
                required: true 
            },
            status: { 
                type: String, 
                default: "Available" 
            },
        },
    ],
});

const RestaurantModel = mongoose.model("Restaurant", restaurantSchema);

export default RestaurantModel;
