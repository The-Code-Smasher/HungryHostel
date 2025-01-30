import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/login', { email, password });
            console.log("Server Response:", response.data);

            if (response.data.message === "Success") {
                console.log("Login Successful:", response.data.user);
                navigate('/');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Login Error:", error.response ? error.response.data : error);
            alert("Login failed. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <div className="tabs">
                <div className="tab active">Login</div>
                <div className="tab" onClick={() => navigate('/register')}>Sign Up</div>
            </div>
            <div className="form-container" id="login">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        placeholder="Enter your email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="Enter your password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className='button' type="submit">Login</button>
                </form>
                <div className="alt-option">
                    Don't have an account? <button onClick={() => navigate('/register')}>Sign Up</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
