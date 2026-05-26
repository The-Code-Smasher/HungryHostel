import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CardContext';
import './payment.css';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Dynamically load Razorpay checkout script
const loadRazorpay = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload  = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

const Payment = () => {
    const location  = useLocation();
    const navigate  = useNavigate();
    const { cart, calculateTotal, removeFromCart } = useCart();

    const totalAmount = location.state?.totalAmount || Number(calculateTotal()) || 0;

    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');
    const [success, setSuccess]   = useState(false);
    const [user, setUser]         = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const cartItems = location.state?.cartItems || Object.entries(cart).map(([id, item]) => ({
        productId: id,
        quantity:  item.quantity,
        price:     item.price,
        name:      item.name,
    }));

    const handlePayment = async () => {
        setError('');
        setLoading(true);

        const loaded = await loadRazorpay();
        if (!loaded) {
            setError('Failed to load payment gateway. Check your internet connection.');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('authToken');

            // Step 1: Create Razorpay order on backend
            const { data } = await axios.post(
                `${BACKEND}/razorpay/create-order`,
                { amount: totalAmount, cartItems },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Step 2: Open Razorpay checkout
            const options = {
                key:         data.key,
                amount:      data.amount,
                currency:    data.currency,
                name:        'HungryHostel',
                description: 'Campus Food Order',
                order_id:    data.orderId,
                prefill: {
                    name:    user?.username || '',
                    email:   user?.email    || '',
                    contact: user?.mobile   || '',
                },
                theme: { color: '#ff6600' },

                handler: async (response) => {
                    try {
                        // Step 3: Verify payment signature
                        const verify = await axios.post(
                            `${BACKEND}/razorpay/verify`,
                            {
                                razorpay_order_id:   response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature:  response.razorpay_signature,
                                cartItems,
                                totalAmount,
                                shippingAddress: location.state?.shippingAddress || 'Campus Hostel',
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        if (verify.data.success) {
                            // Clear cart
                            Object.keys(cart).forEach((id) => removeFromCart(id));
                            setSuccess(true);
                            setTimeout(() => navigate('/'), 2500);
                        } else {
                            setError('Payment verification failed. Contact support.');
                        }
                    } catch (err) {
                        setError('Verification error: ' + (err.response?.data?.message || err.message));
                    } finally {
                        setLoading(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        setError('Payment cancelled.');
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not initiate payment.');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="pay-page">
                <div className="pay-success">
                    <div className="pay-success-icon">✅</div>
                    <h2>Payment Successful!</h2>
                    <p>Your order has been placed. Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pay-page">
            <div className="pay-card">
                <div className="pay-header">
                    <button className="pay-back" onClick={() => navigate(-1)} aria-label="Go back">
                        ← Back
                    </button>
                    <h2 className="pay-title">Order Summary</h2>
                </div>

                {/* Cart Items */}
                <div className="pay-items">
                    {cartItems.length === 0 ? (
                        <p className="pay1-empty">Your cart is empty.</p>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.productId} className="pay-item">
                                <span className="pay-item-name">{cart[item.productId]?.name || item.name || `Item #${item.productId.slice(-5)}`}</span>
                                <span className="pay-item-qty">× {item.quantity}</span>
                                <span className="pay-item-price">₹{item.price * item.quantity}</span>
                            </div>
                        ))
                    )}
                </div>

                {/* Delivery Address */}
                <div className="pay-address-block">
                    <span className="pay-addr-label">📍 Delivery Location</span>
                    <p className="pay-addr-text">{location.state?.shippingAddress || "Campus Hostel"}</p>
                </div>

                <div className="pay-divider" />

                <div className="pay-total-row">
                    <span>Total Amount</span>
                    <span className="pay-total-amount">₹{totalAmount}</span>
                </div>

                {error && <p className="pay-error">{error}</p>}

                <button
                    className="pay-btn"
                    onClick={handlePayment}
                    disabled={loading || cartItems.length === 0}
                >
                    {loading ? (
                        <span className="pay-spinner" aria-label="Processing" />
                    ) : (
                        <>Pay ₹{totalAmount} with Razorpay</>
                    )}
                </button>

                <p className="pay-note">🔒 Secured by Razorpay · UPI · Cards · NetBanking</p>
            </div>
        </div>
    );
};

export default Payment;