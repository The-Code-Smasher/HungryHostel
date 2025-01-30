// const mongoose = require('mongoose');

// const dbconnection = () => {
//     return mongoose.connect("mongodb://localhost:27017/hungryhostel/", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//     })
//     .then(() => console.log("✅ MongoDB connected successfully!"))
//     .catch(err => console.log("❌ MongoDB connection error:", err));
// };

// module.exports = dbconnection;

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();  // Load environment variables

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/hungryhostel/hungryhostel", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};
