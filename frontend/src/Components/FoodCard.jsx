import React from "react";
import { useCart } from "../context/CardContext.jsx";
import "./FoodItems.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // Handle Windows backslashes from multer on Windows dev machines
    const normalized = imagePath.replace(/\\/g, "/");
    const uploadsIdx = normalized.indexOf("uploads/");
    if (uploadsIdx !== -1) {
        return `${BACKEND_URL}/${normalized.slice(uploadsIdx)}`;
    }
    // If path starts with http already
    if (normalized.startsWith("http")) return normalized;
    return `${BACKEND_URL}/${normalized}`;
};

const FoodCard = ({ product }) => {
    const { cart, addToCart, updateQuantity } = useCart();
    const quantity = cart[product._id]?.quantity || 0;

    // images can be a string OR an array (old vs new data)
    const rawImage = Array.isArray(product.images)
        ? product.images[0]
        : product.images;

    const imageUrl = rawImage ? getImageUrl(rawImage) : null;

    return (
        <div className="food-card">
            <div className="card-img">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="food-image"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                ) : null}
                <div className="no-image" style={{ display: imageUrl ? 'none' : 'flex' }}>🍽️</div>
                <span className="category-badge">{product.category}</span>
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
                        <button
                            className="add-to-cart"
                            onClick={() => addToCart(product._id, product.price, product.name)}
                        >
                            ADD <span className="zomato-plus">+</span>
                        </button>
                    ) : (
                        <div className="quantity-controls">
                            <button onClick={() => updateQuantity(product._id, quantity - 1)}>-</button>
                            <span className="quantity">{quantity}</span>
                            <button onClick={() => updateQuantity(product._id, quantity + 1)}>+</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodCard;