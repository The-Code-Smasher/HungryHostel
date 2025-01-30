import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Register = () => {
    const navigate = useNavigate();

    return (
        <div className="auth-container">
            <div className="tabs">
                <div className="tab" onClick={() => navigate('/login')}>Login</div>
                <div className="tab active">Sign Up</div>
            </div>
            <div className="form-container" id="signup">
                <form>
                    <label htmlFor="username">User Name</label>
                    <input type="text" id="username" placeholder="Enter your username" required />

                    <label htmlFor="phone">Phone</label>
                    <input type="text" id="phone" placeholder="Enter your phone number" required />

                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Enter your email" required />

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Enter your password" required />

                    <button className='button' type="button" onClick={() => navigate('/')}>Register</button>
                </form>
                <div className="alt-option">
                    Already have an account? <button className='btn' onClick={() => navigate('/login')}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default Register;
