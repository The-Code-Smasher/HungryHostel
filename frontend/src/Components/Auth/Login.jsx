import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/login", { identifier, password });
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
    console.error("Login Error:", error);
    alert(error.response?.data?.message || "Login failed. Please try again.");
}

    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="login-main">
        <div className="auth-container">
            <div className="tabs">
                <div className="tab" onClick={() => navigate('/register')}>Sign Up</div>
                <div className="tab active">Login</div>
            </div>
            <div className="login-container" id="login">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="identifier">Email/Username/Phone</label>
                    <input 
                        type="text" 
                        id="identifier" 
                        placeholder="Enter your email, username, or phone no." 
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
                    <button className='button' type="button" onClick={() => navigate('/resturant-login')}>Restaurant Login</button>
                </form>
                <div className="alt-option">
                    Don't have an account? <button onClick={() => navigate('/register')}>Sign Up</button>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Login;
