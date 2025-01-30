import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    return (
        <div className="auth-container">
            <div className="tabs">
                <div className="tab active">Login</div>
                <div className="tab" onClick={() => navigate('/register')}>Sign Up</div>
            </div>
            <div className="form-container" id="login">
                <form>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Enter your email" required />

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Enter your password" required />

                    <button className='button' type="button" onClick={() => navigate('/')}>Login</button>
                </form>
                <div className="alt-option">
                    Don't have an account? <button onClick={() => navigate('/register')}>Sign Up</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
