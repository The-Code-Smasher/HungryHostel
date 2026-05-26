import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import './Address.css';

const Address = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const totalAmount = location.state?.totalAmount;
    const cartItems   = location.state?.cartItems;

    // Safety redirect if accessed directly with no items
    useEffect(() => {
        if (!totalAmount || !cartItems) {
            navigate('/');
        }
    }, [totalAmount, cartItems, navigate]);

    const [delivereeName, setDelivereeName] = useState('');
    const [mobile, setMobile]               = useState('');
    const [hostel, setHostel]               = useState('');
    const [roomNo, setRoomNo]               = useState('');
    const [instructions, setInstructions]   = useState('');
    const [error, setError]                 = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.username) setDelivereeName(parsed.username);
                if (parsed.mobile) setMobile(parsed.mobile);
                if (parsed.hostel) setHostel(parsed.hostel);
                if (parsed.roomNo) setRoomNo(parsed.roomNo);
            } catch (err) {
                console.error("Error loading user profile:", err);
            }
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!delivereeName.trim()) {
            setError('Please enter delivery contact name.');
            return;
        }
        if (!/^\d{10}$/.test(mobile)) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }
        if (!hostel) {
            setError('Please select your Hostel.');
            return;
        }
        if (!roomNo.trim()) {
            setError('Please enter your Room Number.');
            return;
        }

        const fullAddress = `${hostel}, Room: ${roomNo.trim()}, Contact: ${delivereeName.trim()} (${mobile})${instructions.trim() ? ` - Instructions: ${instructions.trim()}` : ''}`;

        // Forward state to final Razorpay payment screen
        navigate('/payment', {
            state: {
                totalAmount,
                cartItems,
                shippingAddress: fullAddress,
            }
        });
    };

    return (
        <div className="addr-page">
            <div className="addr-card">
                <div className="addr-header">
                    <button className="addr-back-btn" onClick={() => navigate('/')}>
                        <MdOutlineKeyboardBackspace size={20} /> Back
                    </button>
                    <h2 className="addr-title">Delivery Address</h2>
                </div>

                <div className="addr-order-banner">
                    <span>Order Total:</span>
                    <strong>₹{totalAmount}</strong>
                </div>

                {error && <div className="addr-error" role="alert">{error}</div>}

                <form onSubmit={handleSubmit} className="addr-form">
                    <div className="addr-group">
                        <label htmlFor="delivereeName">Deliveree Name</label>
                        <input
                            type="text"
                            id="delivereeName"
                            placeholder="Enter contact name"
                            value={delivereeName}
                            onChange={e => setDelivereeName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="addr-group">
                        <label htmlFor="mobile">Mobile Number</label>
                        <input
                            type="text"
                            id="mobile"
                            placeholder="10-digit delivery contact number"
                            maxLength="10"
                            value={mobile}
                            onChange={e => setMobile(e.target.value)}
                            required
                        />
                    </div>

                    <div className="addr-row">
                        <div className="addr-group">
                            <label htmlFor="hostel">Select Hostel</label>
                            <select
                                id="hostel"
                                value={hostel}
                                onChange={e => setHostel(e.target.value)}
                                required
                            >
                                <option value="" disabled>Choose Hostel</option>
                                <option value="SVBH Hostel">SVBH Hostel</option>
                                <option value="SVBH Ext.">SVBH Ext.</option>
                                <option value="Malviya Hostel">Malviya Hostel</option>
                                <option value="Tilak Hostel">Tilak Hostel</option>
                                <option value="Tandon Hostel">Tandon Hostel</option>
                                <option value="Patel Hostel">Patel Hostel</option>
                                <option value="Raman Hostel">Raman Hostel</option>
                                <option value="PG Hostel">PG Hostel</option>
                                <option value="Girls Hostel (IH)">Girls Hostel (IH)</option>
                                <option value="Girls Hostel (Maitreyi)">Girls Hostel (Maitreyi)</option>
                            </select>
                        </div>

                        <div className="addr-group">
                            <label htmlFor="roomNo">Room No</label>
                            <input
                                type="text"
                                id="roomNo"
                                placeholder="e.g. 102"
                                value={roomNo}
                                onChange={e => setRoomNo(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="addr-group">
                        <label htmlFor="instructions">Delivery Instructions (Optional)</label>
                        <textarea
                            id="instructions"
                            placeholder="e.g. Leave at guard room / call when outside SVBH gate"
                            rows="2"
                            value={instructions}
                            onChange={e => setInstructions(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="addr-submit-btn">
                        Proceed to Payment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Address;
