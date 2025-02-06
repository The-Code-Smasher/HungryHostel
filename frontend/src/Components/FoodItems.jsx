import React, { useState, useEffect } from "react";
import axios from "axios";
import FoodCard from "./FoodCard";
import "./FoodItems.css";

const FoodItems = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5173";

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000')
                console.log("Full API Response:", response);

                // Ensure the response contains an array
                const productsArray = response.data.data || response.data;

                if (Array.isArray(productsArray)) {
                    setProducts(productsArray);
                } else {
                    console.error("Unexpected response format:", response.data);
                    throw new Error("Invalid data format: Expected an array.");
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <p>Loading food items...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
    if (!loading && products.length === 0) return <p>No food items available.</p>;

    return (
        <div className="food-grid">
            {products.map((item) => (
                <FoodCard key={item._id} product={item} />
            ))}
        </div>
    );
};

export default FoodItems;