import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import axios from "axios";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import Razorpay from "razorpay";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import UserModel from "./models/user.js";
import RestaurantModel from "./models/restaurant.js";
import ProductModel from "./models/product.js";

dotenv.config();

// Initialize the app
const app = express();

// Ensure 'uploads/' folder exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadFolder = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

// Payment Constants
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Multer Configuration for File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// Authorization Middleware
const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};

const upload = multer({ storage }).single("images");

// ════════════════════════════════════════════════════════════════
//  RAZORPAY ROUTES
// ════════════════════════════════════════════════════════════════

// Create Razorpay order
app.post("/razorpay/create-order", authMiddleware, async (req, res) => {
    try {
        const { amount, cartItems } = req.body;     // amount in rupees
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const options = {
            amount:   Math.round(amount * 100),     // paise
            currency: "INR",
            receipt:  "order_" + Date.now(),
            notes:    { userId: req.user.id },
        };

        const order = await razorpay.orders.create(options);
        res.json({
            orderId:  order.id,
            amount:   order.amount,
            currency: order.currency,
            key:      process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Razorpay order error:", error);
        res.status(500).json({ message: "Could not create payment order" });
    }
});

// Verify Razorpay payment signature & save order
app.post("/razorpay/verify", authMiddleware, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            cartItems,
            totalAmount,
            shippingAddress,
        } = req.body;

        // Signature check
        const body      = razorpay_order_id + "|" + razorpay_payment_id;
        const expected  = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expected !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        // Save order to DB
        const items = cartItems.map((item) => ({
            productId: item.productId,
            quantity:  item.quantity,
            price:     item.price,
        }));

        const newOrder = await OrderModel.create({
            userId:          req.user.id,
            items,
            totalAmount,
            shippingAddress: shippingAddress || "Campus",
            paymentStatus:   "Paid",
            status:          "Confirmed",
        });

        // Attach order to user
        await UserModel.findByIdAndUpdate(req.user.id, {
            $push: {
                orders: {
                    orderId:     newOrder._id,
                    orderStatus: "Confirmed",
                    totalAmount,
                },
            },
        });

        res.json({ success: true, orderId: newOrder._id });
    } catch (error) {
        console.error("Verify error:", error);
        res.status(500).json({ message: "Server error during verification" });
    }
});

// 🔹 Product Upload Route
app.post("/restaurant/listproductaddform", authMiddleware, upload, async (req, res) => {
    try {
        const { name, category, price, description, canteen } = req.body;
        const image = req.file ? req.file.path : null;

        if (!name || !category || !price || !description || !canteen || !image) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        const newProduct = new ProductModel({
            name: name.toLowerCase().trim(),
            category: category.toLowerCase(),
            price: Number(price),
            description,
            canteen,
            images: [image],
        });

        await newProduct.save();
        res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        console.error("Product upload error:", error.message);
        res.status(500).json({ message: "Error creating product" });
    }
});

// 🔹 Fetch Products Route
app.get("/products", async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category && category !== "all" ? { category: category.toLowerCase() } : {};
        const products = await ProductModel.find(filter);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.get("/", (req, res) => res.send("HungryHostel API is running."));

// DELETE a product
app.delete("/products/:id", authMiddleware, async (req, res) => {
    try {
        await ProductModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete product" });
    }
});

// Restaurant dashboard data
app.get("/restaurant/dashboard", authMiddleware, async (req, res) => {
    try {
        const restaurant = await RestaurantModel.findById(req.user.id);
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
        const products = await ProductModel.find({ canteen: restaurant.name });
        res.json({ restaurant, products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    2}
});

// 🔹 Login Route
app.post("/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const user = await UserModel.findOne({
            $or: [{ email: identifier }, { username: identifier }, { mobile: identifier }],
        });

        if (!user) return res.status(404).json({ message: "No record found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Success", user, token});
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// restaurant Login
app.post("/resturant-login", async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const resturant = await RestaurantModel.findOne({
            $or: [{ email: identifier }, { name: identifier }, { mobile: identifier }],
        });

        if (!resturant) return res.status(404).json({ message: "No record found" });

        const isMatch = await bcrypt.compare(password, resturant.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign({ id: resturant._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Success", resturant, token });
    } catch (error) {
        console.error("Restaurant Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// 🔹 Register Route
app.post("/register", async (req, res) => {
    try {
        const { username, mobile, email, password } = req.body;
        const existing = await UserModel.findOne({ $or: [{ email }, { mobile }]});
        if (existing) {
            return res.status(400).json({message: "User already exists."});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await new UserModel({ username, mobile, email, password: hashedPassword }).save();

        res.json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));