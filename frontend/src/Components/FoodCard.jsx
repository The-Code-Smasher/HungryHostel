import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CardContext.jsx";
import "./FoodItems.css";

const FoodCard = ({ _id, name, price, description, canteen, images }) => {
    const { cart, addToCart, updateQuantity } = useCart();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:8000/fooditems");
                setProducts(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };        

        fetchProducts();
    }, []);

    return (
        <div className="food-card-container">
            {products.length > 0 ? (
                products.map((product) => {
                    const quantity = cart[product.id]?.quantity || 0;

                    return (
                        <div className="food-card" key={product.id}>
                            <div className="card-img">
                                <img src={product.images} alt={product.title} className="food-image" />
                            </div>
                            <div className="food-info">
                                <div className="title-price">
                                    <h2 className="food-title">{product.name}</h2>
                                    <span className="food-price">₹{product.price}</span>
                                </div>
                                <span className="dis-cant">{product.description}</span>
                                <span className="dis-cant">{product.canteen}</span>
                                <span className="dis-cant">MNNIT ALLAHABAD</span>
                                <div className="rating-cart">
                                    <span className="rating">⭐⭐⭐⭐☆</span>
                                    {quantity === 0 ? (
                                        <button className="add-to-cart" onClick={() => addToCart(product.id, product.price)}>
                                            Add to Cart
                                        </button>
                                    ) : (
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(product.id, quantity - 1)}>-</button>
                                            <span className="quantity">{quantity}</span>
                                            <button onClick={() => updateQuantity(product.id, quantity + 1)}>+</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>No products available.</p>
            )}
        </div>
    );
};

export default FoodCard;
