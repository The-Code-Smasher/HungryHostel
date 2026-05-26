import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import './Login.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm]             = useState({ username: '', mobile: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState('');
    const [success, setSuccess]       = useState('');

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!/^\d{10}$/.test(form.mobile)) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${BACKEND_URL}/register`, form);
            setSuccess('Account created! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-main">
            <div className="auth-container">
                <div className="tabs">
                    <div className="tab active">Sign Up</div>
                    <div className="tab" onClick={() => navigate('/login')}>Login</div>
                </div>
                <div className="login-container">
                    <form onSubmit={handleSubmit}>
                        <label>Username</label>
                        <input
                            type="text" name="username" placeholder="Pick a username"
                            required value={form.username} onChange={handleChange}
                        />

                        <label>Mobile Number</label>
                        <input
                            type="text" name="mobile" placeholder="10-digit number"
                            required maxLength="10" value={form.mobile} onChange={handleChange}
                        />

                        <label>Email</label>
                        <input
                            type="email" name="email" placeholder="your@email.com"
                            required value={form.email} onChange={handleChange}
                        />

                        <label>Password</label>
                        <div className="password">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password" placeholder="Min 6 characters"
                                required value={form.password} onChange={handleChange}
                            />
                            {showPassword
                                ? <FaEyeSlash className="pass-icon" onClick={() => setShowPassword(false)} />
                                : <FaEye     className="pass-icon" onClick={() => setShowPassword(true)} />
                            }
                        </div>

                        {error   && <div className="auth-error">{error}</div>}
                        {success && <div className="auth-success">{success}</div>}

                        <button className="button" type="submit" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                    <div className="alt-option">
                        Already have an account?
                        <button onClick={() => navigate('/login')}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;