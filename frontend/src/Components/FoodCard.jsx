import React from "react";
import { useCart } from "../context/CardContext.jsx";
import "./FoodItems.css";

const FoodCard = ({ product }) => {
    const { cart, addToCart, updateQuantity } = useCart();
    const quantity = cart[product._id]?.quantity || 0;

    return (
        <div className="food-card">
            <div className="card-img">
                
                {product.images && product.images.length > 0 ? (
                    product.images.map((image, index) => (
                        <img
                        key={index}
                        src={`http://localhost:8000/${image.replace(/^.*[\\\/]uploads[\\\/]/, "uploads/")}`}
                        alt={product.name}
                        className="food-image"
                        />
                    ))
                ) : (
                    <p>No images available</p>
                )}
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
                            onClick={() => addToCart(product._id, product.price)}
                        >
                            Add to Cart
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