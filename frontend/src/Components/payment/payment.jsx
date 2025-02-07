import axios from 'axios';
import { useLocation } from "react-router-dom";
import React, { useState } from 'react';
import './payment.css';

const Payment = () => {
    const location = useLocation();
    const totalAmount = location.state?.totalAmount || 0;
    const [upiid, setUPIid] = useState('');
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Submitting payment with amount: ", totalAmount);

        try {
            const data = {
                upiid,
                mobile,
                amount: totalAmount,
                MUID: "MUIDW" + Date.now(),
                transactionID: "T" + Date.now(),
            };

            const response = await axios.post(`http://localhost:8000/order`, data);
            console.log("Response from server: ", response); 

            if (response.data && response.data.data.instrumentResponse.redirectInfo.url) {
                window.location.href = response.data.data.instrumentResponse.redirectInfo.url;
            } else {
                alert("Payment gateway redirect URL is missing.");
            }
        } catch (error) {
            console.log("Error during payment submission: ", error);
            alert("An error occurred while processing your payment.");
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="payment-form">
            <h2>Payment Form</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>UPI ID</label>
                    <input
                        type="text"
                        name="upiid"
                        value={upiid}
                        onChange={(e) => setUPIid(e.target.value)}
                        placeholder='Enter your UPI ID'
                        required
                    />
                </div>
                <div>
                    <label>Mobile Number</label>
                    <input
                        type="tel"
                        name="mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder='Enter your mobile number'
                        maxLength="10"
                        required
                    />
                </div>
                <div>
                    <label>Amount</label>
                    <input
                        type="text"
                        name="amount"
                        value={totalAmount}
                        disabled
                    />
                </div>
                <button type="submit" className="pay" disabled={loading}>
                    {loading ? "Processing..." : "Pay Now"}
                </button>
            </form>
        </div>
    );
};

export default Payment;