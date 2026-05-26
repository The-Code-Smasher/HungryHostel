import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CardContext';
import './Profile.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const Profile = ({ onClose }) => {
    const navigate = useNavigate();
    const { getTotalCount } = useCart();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving]       = useState(false);
    const [error, setError]         = useState('');
    const [editForm, setEditForm]   = useState({ username: '', mobile: '', hostel: '', roomNo: '' });

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${BACKEND_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching customer orders:", err);
            setOrders([]);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleLogout = () => {
        ['authToken', 'loginTime', 'user', 'cart'].forEach(k => localStorage.removeItem(k));
        onClose();
        navigate('/login');
    };

    const startEditing = () => {
        setEditForm({
            username: user?.username || '',
            mobile: user?.mobile || '',
            hostel: user?.hostel || '',
            roomNo: user?.roomNo || '',
        });
        setError('');
        setIsEditing(true);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');

        if (!editForm.username.trim()) {
            setError('Username cannot be empty.');
            return;
        }
        if (!/^\d{10}$/.test(editForm.mobile)) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${BACKEND_URL}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editForm),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                setIsEditing(false);
            } else {
                setError(data.message || 'Failed to update profile.');
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setError('Server connection error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const initials = user?.username
        ? user.username.slice(0, 2).toUpperCase()
        : 'U';

    return (
        <>
            <div className="profile-backdrop" onClick={onClose} aria-hidden="true" />
            <div className="profile-panel" role="dialog" aria-label="User profile">
                <div className="profile-header">
                    <span className="profile-title">{isEditing ? "Edit Profile" : "My Account"}</span>
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
                        <span className="pstat-val">{orders.length}</span>
                        <span className="pstat-label">Orders</span>
                    </div>
                </div>

                {/* Details */}
                {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="profile-edit-form">
                        <div className="pe-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={editForm.username}
                                onChange={e => setEditForm({...editForm, username: e.target.value})}
                                required
                            />
                        </div>
                        <div className="pe-group">
                            <label>Mobile Number</label>
                            <input
                                type="text"
                                value={editForm.mobile}
                                onChange={e => setEditForm({...editForm, mobile: e.target.value})}
                                required
                                maxLength="10"
                            />
                        </div>
                        <div className="pe-row">
                            <div className="pe-group">
                                <label>Hostel</label>
                                <select
                                    value={editForm.hostel}
                                    onChange={e => setEditForm({...editForm, hostel: e.target.value})}
                                >
                                    <option value="">Not set</option>
                                    <option value="SVBH Hostel">SVBH Hostel</option>
                                    <option value="SVBH Ext.">SVBH Ext.</option>
                                    <option value="Malviya Hostel">Malviya Hostel</option>
                                    <option value="Tilak Hostel">Tilak Hostel</option>
                                    <option value="Tandon Hostel">Tandon Hostel</option>
                                    <option value="Patel Hostel">Patel Hostel</option>
                                    <option value="Raman Hostel">Raman Hostel</option>
                                    <option value="PG Hostel">PG Hostel</option>
                                    <option value="Girls Hostel (IH)">Girls Hostel (IH)</option>
                                    <option value="Girls Hostel (Maitreyi)">Girls Hostel (Maitreyi)</option>
                                </select>
                            </div>
                            <div className="pe-group">
                                <label>Room No</label>
                                <input
                                    type="text"
                                    value={editForm.roomNo}
                                    onChange={e => setEditForm({...editForm, roomNo: e.target.value})}
                                    placeholder="e.g. 102"
                                />
                            </div>
                        </div>
                        {error && <p className="pe-error">{error}</p>}
                        <div className="pe-actions">
                            <button type="submit" className="pe-save-btn" disabled={saving}>
                                {saving ? "Saving..." : "Save Details"}
                            </button>
                            <button type="button" className="pe-cancel-btn" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
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
                        <div className="profile-detail-row">
                            <span className="pd-label">Hostel</span>
                            <span className="pd-val">{user?.hostel || 'Not set'}</span>
                        </div>
                        <div className="profile-detail-row">
                            <span className="pd-label">Room No</span>
                            <span className="pd-val">{user?.roomNo || 'Not set'}</span>
                        </div>
                        <div className="profile-edit-trigger-wrap">
                            <button type="button" className="profile-edit-trigger" onClick={startEditing}>
                                Edit Details
                            </button>
                        </div>
                    </div>
                )}

                {/* Order Logs */}
                <div className="profile-orders-section">
                    <h3 className="profile-orders-title">📋 My Order Logs</h3>
                    {loadingOrders ? (
                        <p className="profile-orders-loading">Loading logs...</p>
                    ) : orders.length === 0 ? (
                        <p className="profile-orders-empty">No orders found.</p>
                    ) : (
                        <div className="profile-orders-list">
                            {orders.map((order) => {
                                const formattedDate = new Date(order.createdAt).toLocaleDateString();
                                return (
                                    <div key={order._id} className="profile-order-card">
                                        <div className="porder-header">
                                            <span className="porder-date">{formattedDate}</span>
                                            <span className={`porder-status status-${order.status?.toLowerCase() || 'pending'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="porder-body">
                                            <ul className="porder-items">
                                                {order.items.map((item, idx) => (
                                                    <li key={idx} className="porder-item">
                                                        <span className="porder-item-name">{item.productId?.name || "Food Item"}</span>
                                                        <span className="porder-item-qty">x{item.quantity}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="porder-footer">
                                                <span className="porder-total">Paid: <strong>₹{order.totalAmount}</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
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