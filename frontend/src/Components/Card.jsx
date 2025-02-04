import React from "react";
import { IoMdClose } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { useCart } from "../context/CardContext";
import { useNavigate } from "react-router-dom";
import "./Card.css";

const Cart = ({ onClose }) => {
    const { cart, calculateTotal, removeFromCart } = useCart();
    const navigate = useNavigate();
    const calculateTotalAmount = () => {
        return calculateTotal();
    };
    const handleCheckout = () => {
        if (calculateTotalAmount() > 0) {
            navigate("/payment", { state: { totalAmount: calculateTotalAmount() } });
        } else {
            alert("Please add items to your cart before proceeding to checkout.");
        }
    };

    return (
        <div className="cart-container">
            <div className="cart-header">
                <span className="cart-title">My Order</span>
                <IoMdClose className="close-icon" onClick={onClose} /> {/* Close button */}
            </div>

            <div className="cart-items">
                {Object.keys(cart).length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    Object.entries(cart).map(([title, { quantity, price }]) => (
                        <div key={title} className="cart-item">
                            <span className="item-name">{title}</span>
                            <span className="item-price">₹{(quantity * price).toFixed(2)}</span>
                            <span className="item-quantity">x{quantity}</span>
                            <FaTrashAlt className="remove-item" onClick={() => removeFromCart(title)} />
                        </div>
                    ))
                )}
            </div>

            <div className="cart-footer">
                <h3 className="cart-entity">Items: {Object.keys(cart).length}</h3>
                <h3 className="cart-entity">Total Amount: ₹{calculateTotal()}</h3>
                <hr className="divider" />
                <button className="checkout-btn" onClick={handleCheckout}>
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;