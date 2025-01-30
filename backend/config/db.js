import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();  
export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/hungryhostel", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};
