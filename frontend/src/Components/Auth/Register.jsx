import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/register', {
                username,
                mobile,
                email,
                password
            });

            console.log("Registration Successful:", response.data);
            alert("Registration successful! Redirecting to login.");
            navigate('/login');
        } catch (error) {
            console.error("Registration Error:", error);
            alert("Registration failed. Please try again.");
        }
    };
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     axios.post('http://localhost:3000/register', {username,mobile, email, password})
    //     .then(result => console.log(result)
    //     )
    //     .catch(err => console.log(err)
    //     )
    // };

    return (
        <div className="auth-container">
            <div className="tabs">
                <div className="tab active">Sign Up</div>
                <div className="tab" onClick={() => navigate('/login')}>Login</div>
            </div>
            <div className="form-container" id="signup">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">User Name</label>
                    <input 
                        type="text" 
                        id="username" 
                        placeholder="Enter your username" 
                        required 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label htmlFor="phone">Phone</label>
                    <input 
                        type="text" 
                        id="phone" 
                        placeholder="Enter your phone number" 
                        required 
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                    />

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

                    <button className='button' type="submit">Register</button>
                </form>
                <div className="alt-option">
                    Already have an account? 
                    <button className='btn' onClick={() => navigate('/login')}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default Register;
