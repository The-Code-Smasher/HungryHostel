import { useState } from 'react';
import { CartProvider } from './context/CardContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerDashboard from './Pages/CustomerDashboard';
import './App.css';
import Payment from './Components/payment/payment';

function App() {
    return (
        <Router>
            <CartProvider>
                <Routes>
                <Route path="/" element={<CustomerDashboard />} />
                <Route path="/payment" element={<Payment />} />
                </Routes>
            </CartProvider>
        </Router>
    )
}

export default App
