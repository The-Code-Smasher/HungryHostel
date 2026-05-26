import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { useCart } from "../context/CardContext";
import axios from "axios";
import "./Card.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

const loadRazorpay = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

const Cart = ({ onClose }) => {
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

        try {
            // Load Razorpay script
            const loaded = await loadRazorpay();
            if (!loaded) {
                alert("Razorpay failed to load. Check your internet connection.");
                setPaying(false);
                return;
            }

            // Create order on backend
            const { data } = await axios.post(`${BACKEND_URL}/api/payment/create-order`, {
                amount: total,
            });

            if (!data.success) {
                alert("Could not create payment order.");
                setPaying(false);
                return;
            }

            const user = JSON.parse(localStorage.getItem("user") || "{}");

            // Open Razorpay modal — stays on same page, no redirect
            const options = {
                key: RAZORPAY_KEY || data.key_id,
                amount: data.amount,
                currency: data.currency,
                name: "Hungry Hostel",
                description: "Food Order Payment",
                order_id: data.order_id,
                handler: async (response) => {
                    try {
                        const verify = await axios.post(`${BACKEND_URL}/api/payment/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verify.data.success) {
                            clearCart();
                            onClose();
                            alert("✅ Payment successful! Your order has been placed.");
                        } else {
                            alert("Payment verification failed. Contact support.");
                        }
                    } catch {
                        alert("Error verifying payment. Contact support.");
                    }
                },
                prefill: {
                    name: user?.username || "",
                    email: user?.email || "",
                    contact: user?.mobile || "",
                },
                theme: { color: "#e63946" },
                modal: {
                    ondismiss: () => setPaying(false),
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Payment error:", err);
            alert("Error initiating payment. Please try again.");
            setPaying(false);
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