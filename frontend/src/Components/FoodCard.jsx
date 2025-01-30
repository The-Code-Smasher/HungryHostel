import React from "react";
import { useCart } from "../context/CardContext.jsx";
import "./FoodItems.css";

const FoodCard = ({ id, title, price, image, canteen, location }) => {
    const { cart, addToCart, updateQuantity } = useCart();
    const quantity = cart[id]?.quantity || 0; // Accessing quantity properly

    return (
        <div className="food-card">
            <img src={image} alt={title} className="food-image" />
            <div className="food-info">
                <div className="title-price">
                    <h2 className="food-title">{title}</h2>
                    <span className="food-price">₹{price}</span>
                </div>
                <span className="dis-cant">Lorem ipsum dolor sit amet.</span>
                <span className="dis-cant">{canteen}</span>
                <span className="dis-cant">{location}</span>
                <div className="rating-cart">
                    <span className="rating">⭐⭐⭐⭐☆</span>

                    {quantity === 0 ? (
                        <button className="add-to-cart" onClick={() => addToCart(id, price)}>
                            Add to Cart
                        </button>
                    ) : (
                        <div className="quantity-controls">
                            <button onClick={() => updateQuantity(id, quantity - 1)}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => updateQuantity(id, quantity + 1)}>+</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodCard;