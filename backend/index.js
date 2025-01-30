import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import axios from "axios";
import crypto from "crypto";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

let salt_key = '96434309-7796-489d-8924-ab56988a6076';
let merchant_id = 'PGTESTPAYUAT86';

app.get("/", (req, res) => {
    res.send("API is running");
});

app.post('/order', async (req, res) => {
    try {
        console.log("Request received:", req.body);

        let {
            MUID,
            transactionID,
            amount,
            upiid,
            mobile,
        } = req.body;

        if (!transactionID || !amount || !mobile) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const data = {
            merchantId: merchant_id,
            merchantTransactionId: transactionID,
            upiid: upiid,
            amount: amount * 100,
            mobileNumber: mobile,
            redirectUrl: `http://localhost:8000/status?id=${transactionID}`,
            redirectMode: 'POST',
            paymentInstrument: {
                type: "PAY_PAGE"
            }
        };

        console.log("Data to be sent:", data);

        const keyIndex = 1;
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const string = payloadMain + `/pg/v1/pay` + salt_key;

        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + `###` + keyIndex;

        console.log("Generated checksum:", checksum);

        const prod_url = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
        const options = {
            method: "POST",
            url: prod_url,
            headers: {
                'accept': "application/json",
                "content-type": "application/json",
                "x-verify": checksum,
            },
            data: {
                request: payloadMain,
            }
        };

        console.log("Sending request to PhonePe:", options);

        await axios(options)
            .then(response => {
                console.log("PhonePe response:", response.data); 
                res.json(response.data);
            })
            .catch(error => {
                console.error("PhonePe API error:", error.message);
                res.status(500).json({ error: error.message });
            });
    } catch (error) {
        console.error("Server error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.post('/status', async (req, res) => {
    try {
        const merchantTransactionId = req.query.id; 
        const merchantId = merchant_id;

        if (!merchantTransactionId) {
            return res.status(400).json({ error: "Missing transaction ID" });
        }

        const keyIndex = 1;
        const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;

        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const options = {
            method: 'GET',
            url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': merchantId,
            },
        };

        console.log("Sending request to PhonePe for status check:", options);

        const response = await axios(options);

        if (response.data && response.data.success) {
            const successUrl = "http://localhost:5173/";
            console.log("Payment successful. Redirecting to:", successUrl);
            return res.redirect(successUrl);
        } else {
            const failureUrl = "http://localhost:5173/failure";
            console.log("Payment failed. Redirecting to:", failureUrl);
            return res.redirect(failureUrl);
        }
    } catch (error) {
        console.error("Error in /status endpoint:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Routes
app.use("/api/users", userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Protect an example route
app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({ message: "You are authorized" });
});
