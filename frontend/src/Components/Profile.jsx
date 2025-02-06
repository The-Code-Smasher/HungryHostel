import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import "./Profile.css";

const Profile = ({ onClose }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("loginTime");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <span className="profile-title">Profile</span>
                <IoMdClose className="close-icon" onClick={onClose} />
            </div>
            <div className="profile-details">
                <p><strong>Username:</strong> {user?.username || "N/A"}</p>
                <p><strong>Email:</strong> {user?.email || "N/A"}</p>
                <p><strong>Mobile:</strong> {user?.mobile || "N/A"}</p>
                <input type="file" />
            </div>
            <div className="profile-footer">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Profile;