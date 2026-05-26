import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const Login = () => {
    const navigate = useNavigate();
    const [identifier, setIdentifier]     = useState('');
    const [password, setPassword]         = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading]           = useState(false);
    const [error, setError]               = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/login`, { identifier, password });

            if (response.data.message === 'Success') {
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('loginTime', new Date().getTime().toString());
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-main">
            <div className="auth-container">
                <div className="tabs">
                    <div className="tab" onClick={() => navigate('/register')}>Sign Up</div>
                    <div className="tab active">Login</div>
                </div>
                <div className="login-container">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="identifier">Email / Username / Phone</label>
                        <input
                            type="text"
                            id="identifier"
                            placeholder="Enter your email, username, or phone"
                            required
                            value={identifier}
                            onChange={e => setIdentifier(e.target.value)}
                        />

                        <label htmlFor="password">Password</label>
                        <div className="password">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            {showPassword
                                ? <FaEyeSlash className="pass-icon" onClick={() => setShowPassword(false)} />
                                : <FaEye     className="pass-icon" onClick={() => setShowPassword(true)} />
                            }
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <button className="button" type="submit" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                        <button className="button outline" type="button" onClick={() => navigate('/resturant-login')}>
                            Restaurant Login
                        </button>
                    </form>
                    <div className="alt-option">
                        Don't have an account?
                        <button onClick={() => navigate('/register')}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;