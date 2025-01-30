import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        minLength: 10,
        lowercase: true,
    },
    mobile: { 
        type: String, 
        minLength: 10,
        required: true 
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    password: { 
        type: String, 
        required: true 
    },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
