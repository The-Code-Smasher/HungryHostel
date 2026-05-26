import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CardContext';
import './Profile.css';

const Profile = ({ onClose }) => {
    const navigate = useNavigate();
    const { getTotalCount } = useCart();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const handleLogout = () => {
        ['authToken', 'loginTime', 'user', 'cart'].forEach(k => localStorage.removeItem(k));
        onClose();
        navigate('/login');
    };

    const initials = user?.username
        ? user.username.slice(0, 2).toUpperCase()
        : 'U';

    return (
        <>
            <div className="profile-backdrop" onClick={onClose} aria-hidden="true" />
            <div className="profile-panel" role="dialog" aria-label="User profile">
                <div className="profile-header">
                    <span className="profile-title">My Account</span>
                    <button className="profile-close" onClick={onClose} aria-label="Close profile">
                        <IoMdClose />
                    </button>
                </div>

                {/* Avatar + Name */}
                <div className="profile-hero">
                    <div className="profile-avatar" aria-hidden="true">{initials}</div>
                    <div className="profile-hero-info">
                        <span className="profile-name">{user?.username || 'User'}</span>
                        <span className="profile-since">Campus Member</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="profile-stats">
                    <div className="profile-stat">
                        <span className="pstat-val">{getTotalCount()}</span>
                        <span className="pstat-label">In Cart</span>
                    </div>
                    <div className="profile-stat">
                        <span className="pstat-val">
                            {JSON.parse(localStorage.getItem('user') || '{}')?.orders?.length || 0}
                        </span>
                        <span className="pstat-label">Orders</span>
                    </div>
                </div>

                {/* Details */}
                <div className="profile-details">
                    <div className="profile-detail-row">
                        <span className="pd-label">Username</span>
                        <span className="pd-val">{user?.username || '—'}</span>
                    </div>
                    <div className="profile-detail-row">
                        <span className="pd-label">Email</span>
                        <span className="pd-val">{user?.email || '—'}</span>
                    </div>
                    <div className="profile-detail-row">
                        <span className="pd-label">Mobile</span>
                        <span className="pd-val">{user?.mobile || '—'}</span>
                    </div>
                </div>

                <div className="profile-footer">
                    <button className="profile-logout-btn" onClick={handleLogout}>
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    );
};

export default Profile;