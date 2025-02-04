import React, { useState, useEffect } from "react";
import axios from "axios";
import FoodCard from "./FoodCard";
import "./FoodItems.css";

const FoodItems = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:8000/fooditems");
                console.log("Fetched Products:", response.data);

                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                } else {
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

    return (
        <div className="food-grid">
            {products.map((item) => (
                <FoodCard key={item._id} product={item} />
            ))}
        </div>
    );
};

export default FoodItems;
