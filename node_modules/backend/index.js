import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import axios from "axios";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import UserModel from "./models/user.js";
import RestaurantModel from "./models/restaurant.js";
import ProductModel from "./models/Product.js";

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
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Payment Constants
const salt_key = process.env.SALT_KEY || "96434309-7796-489d-8924-ab56988a6076";
const merchant_id = process.env.MERCHANT_ID || "PGTESTPAYUAT86";

// app.get("/", (req, res) => res.send("API is running"));

// Multer Configuration for File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage }).single("images");

// 🔹 Order Processing Route
app.post("/order", async (req, res) => {
    try {
        const { transactionID, amount, upiid, mobile } = req.body;
        if (!transactionID || !amount || !mobile) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const data = {
            merchantId: merchant_id,
            merchantTransactionId: transactionID,
            upiid,
            amount: amount * 100,
            mobileNumber: mobile,
            redirectUrl: `http://localhost:8000/status?id=${transactionID}`,
            redirectMode: "POST",
            paymentInstrument: { type: "PAY_PAGE" },
        };

        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString("base64");
        const string = payloadMain + "/pg/v1/pay" + salt_key;
        const sha256 = crypto.createHash("sha256").update(string).digest("hex");
        const checksum = sha256 + "###1";

        const response = await axios.post(
            "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
            { request: payloadMain },
            {
                headers: { accept: "application/json", "content-type": "application/json", "x-verify": checksum },
            }
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 Order Status Route
app.post("/status", async (req, res) => {
    try {
        const merchantTransactionId = req.query.id;
        if (!merchantTransactionId) {
            return res.status(400).json({ error: "Missing transaction ID" });
        }

        const string = `/pg/v1/status/${merchant_id}/${merchantTransactionId}` + salt_key;
        const sha256 = crypto.createHash("sha256").update(string).digest("hex");
        const checksum = sha256 + "###1";

        const response = await axios.get(
            `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchant_id}/${merchantTransactionId}`,
            {
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    "X-VERIFY": checksum,
                    "X-MERCHANT-ID": merchant_id,
                },
            }
        );

        res.redirect(response.data.success ? "http://localhost:5173/" : "http://localhost:5173/failure");
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// 🔹 Product Upload Route
app.post("/restaurant/listproductaddform", upload, async (req, res) => {
    try {
        const { name, category, price, description, canteen } = req.body;
        const image = req.file ? req.file.path : null;

        if (!name || !category || !price || !description || !canteen || !image) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        const newProduct = new ProductModel({
            name,
            category,
            price,
            description,
            canteen,
            images: image,
        });

        await newProduct.save();
        res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
});

// 🔹 Fetch Products Route
app.get("/products", async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

app.get("/", async (req, res) => {
    try {
        const foodItems = await ProductModel.find();
        res.json(foodItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching food items" });
    }
});


// Authorization Middleware
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.resturant = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};


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

        res.json({ message: "Success", user});
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ username, mobile, email, password: hashedPassword });

        await newUser.save();
        res.json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));