import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Auth/Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8000/resturant-login`, { identifier, password });
            console.log("Server Response:", response.data);

            if (response.data.message === "Success") {
                console.log("Login Successful:", response.data.user);
                localStorage.setItem("authToken", response.data.token);
                localStorage.setItem("loginTime", new Date().getTime().toString());
                localStorage.setItem("user", JSON.stringify(response.data.user));
                navigate('/');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Login Error:", error.response ? error.response.data : error);
            alert("Login failed. Please try again.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="login-main">
        <div className="auth-container">
        <h3 className='resturant-lgn-title'>Restaurant Login</h3>
            <div className="login-container" id="login">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="identifier">Username</label>
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
                        {showPassword ? (
                            <FaEyeSlash className="pass-icon" onClick={togglePasswordVisibility} />
                        ) : (
                            <FaEye className="pass-icon" onClick={togglePasswordVisibility}/>
                        )}
                    </div>
                    <button className='button' type="submit">Login</button>
                    <button className='button' type="restaurant-login" onClick={() => navigate('/login')}>Customer Login</button>
                </form>
            </div>
        </div>
        </div>
    );
};

export default Login;
