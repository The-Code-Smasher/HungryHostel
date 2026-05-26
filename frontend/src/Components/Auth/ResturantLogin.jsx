import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Auth/ResturantLogin.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const RestaurantLogin = () => {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${BACKEND_URL}/resturant-login`, { identifier, password });

            if (response.data.message === "Success") {
                localStorage.setItem("authToken", response.data.token);
                localStorage.setItem("loginTime", new Date().getTime().toString());
                localStorage.setItem('resturant', JSON.stringify(response.data.resturant));
                navigate('/resturant');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Login Error:", error.response ? error.response.data : error);
            alert("Login failed. Please try again.");
        } finally{
            setLoading(false);
        }
    };

    return (
        <div className="login-main">
            <div className="auth-container">
                <h3 className='resturant-lgn-title'>Restaurant Login</h3>
                <div className="login-container" id="login">
                    {error && <div className="auth-error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="identifier">Username ? Email ? Phone</label>
                        <input
                            type="text"
                            id="identifier"
                            placeholder="Enter your username"
                            required
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />

                        <label htmlFor="password">Password</label>
                        <div className="password">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {showPassword
                                ? <FaEyeSlash className="pass-icon" onClick={() => setShowPassword(false)} />
                                : <FaEye className="pass-icon" onClick={() => setShowPassword(true)} />
                            }
                        </div>
                        <button className='button' type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                        <button className="button outline" type="button" onClick={() => navigate('/login')}>
                            Customer Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RestaurantLogin;
