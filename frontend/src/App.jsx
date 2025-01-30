import { useState } from 'react';
import { CartProvider } from './context/CardContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerDashboard from './Pages/CustomerDashboard';
import './App.css';
import Payment from './Components/payment/payment';
import Login from './Components/Login/login';
import Register from './Components/Login/Register';

function App() {
    return (
        <Router>
            <CartProvider>
                <Routes>
                <Route path="/" element={<CustomerDashboard />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                </Routes> 
            </CartProvider>
        </Router>
    )
}

export default App
