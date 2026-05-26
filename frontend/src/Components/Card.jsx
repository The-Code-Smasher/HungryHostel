import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { useCart } from "../context/CardContext";
import axios from "axios";
import "./Card.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const Cart = ({ onClose }) => {
    const navigate = useNavigate();
    const { cart, calculateTotal, removeFromCart, updateQuantity, clearCart } = useCart();
    const [paying, setPaying] = useState(false);
    const entries = Object.entries(cart);
    const total = parseFloat(calculateTotal());

    const handleCheckout = async () => {
        if (total <= 0) {
            alert("Your cart is empty.");
            return;
        }

        setPaying(true);

        const cartItems = entries.map(([id, item]) => ({
            productId: id,
            quantity:  item.quantity,
            price:     item.price,
            name:      item.name
        }));

        const token = localStorage.getItem("authToken");

        if (total <= 1) {
            // Direct placement flow (orders <= ₹1)
            try {
                const response = await axios.post(
                    `${BACKEND_URL}/orders/direct`,
                    { cartItems, totalAmount: total, shippingAddress: "Campus Hostel" },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data.success) {
                    clearCart();
                    onClose();
                    alert("✅ Order placed successfully! (Direct Checkout)");
                } else {
                    alert("Failed to place direct order.");
                }
            } catch (err) {
                console.error("Direct order error:", err);
                alert("Error placing direct order. Please try again.");
            } finally {
                setPaying(false);
            }
        } else {
            // Address redirection flow (orders > ₹1)
            setPaying(false);
            onClose();
            navigate("/address", { state: { totalAmount: total, cartItems } });
        }
    };

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div className="cart-container" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                    <span className="cart-title">My Order</span>
                    <IoMdClose className="close-icon" onClick={onClose} />
                </div>

                <div className="cart-items">
                    {entries.length === 0 ? (
                        <div className="cart-empty">
                            <p>🛒 Your cart is empty</p>
                            <span>Add some food to get started!</span>
                        </div>
                    ) : (
                        entries.map(([id, item]) => (
                            <div key={id} className="cart-item">
                                <div className="item-info">
                                    <span className="item-name">{item.name || "Food item"}</span>
                                    <span className="item-unit">₹{item.price} each</span>
                                </div>
                                <div className="item-controls">
                                    <div className="qty-btns">
                                        <button onClick={() => updateQuantity(id, item.quantity - 1)}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(id, item.quantity + 1)}>+</button>
                                    </div>
                                    <span className="item-subtotal">
                                        ₹{(item.quantity * item.price).toFixed(2)}
                                    </span>
                                    <FaTrashAlt
                                        className="remove-icon"
                                        onClick={() => removeFromCart(id)}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div className="cart-summary">
                        <span>{entries.length} item{entries.length !== 1 ? "s" : ""}</span>
                        <span className="cart-total">₹{calculateTotal()}</span>
                    </div>
                    <button
                        className="checkout-btn"
                        onClick={handleCheckout}
                        disabled={entries.length === 0 || paying}
                    >
                        {paying ? "Opening Payment..." : `Pay ₹${calculateTotal()}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;