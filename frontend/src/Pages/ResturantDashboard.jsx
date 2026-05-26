import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./ResturantDashboard.css";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const EMOJI_MAP = { breakfast: "🌅", lunch: "🍱", dinner: "🌙", snacks: "🍟" };

const RestaurantDashboard = () => {
    const navigate = useNavigate();
    const [allItems, setAllItems] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, msg: "" });
    const [restaurant, setRestaurant] = useState({ name: "Campus Kitchen", address: "", mobile: "", email: "", isVerified: false });
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("menu");

    useEffect(() => {
        let stored = {};
        try {
            const raw = localStorage.getItem("resturant");
            if (raw && raw !== "undefined") {
                stored = JSON.parse(raw);
            }
        } catch (e) {
            console.error("Error parsing stored resturant:", e);
        }
        if (stored?.name) setRestaurant(stored);
        fetchDashboardData();
        fetchOrders();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${BACKEND}/restaurant/dashboard`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            
            if (data.restaurant) {
                setRestaurant(data.restaurant);
                localStorage.setItem("resturant", JSON.stringify(data.restaurant));
            }
            
            const items = Array.isArray(data.products) ? data.products : [];
            setAllItems(items);
            setFiltered(activeFilter === "all" ? items : items.filter(i => i.category === activeFilter));
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setAllItems([]);
            setFiltered([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${BACKEND}/restaurant/orders`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setOrders([]);
        }
    };

    const handleFilter = (cat) => {
        setActiveFilter(cat);
        setFiltered(cat === "all" ? allItems : allItems.filter(i => i.category === cat));
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("authToken");
            await fetch(`${BACKEND}/products/${id}`, { 
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        } catch { /* silent fail */ }
        const updated = allItems.filter(i => i._id !== id);
        setAllItems(updated);
        setFiltered(activeFilter === "all" ? updated : updated.filter(i => i.category === activeFilter));
        showToast("Item removed from menu");
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${BACKEND}/restaurant/orders/${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                showToast(`Order status updated to ${newStatus}`);
                fetchOrders();
            } else {
                showToast("Failed to update status");
            }
        } catch {
            showToast("Error updating order status");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("loginTime");
        localStorage.removeItem("user");
        localStorage.removeItem("resturant");
        navigate("/resturant-login");
    };

    const showToast = (msg) => {
        setToast({ show: true, msg });
        setTimeout(() => setToast({ show: false, msg: "" }), 2500);
    };

    const avgPrice = allItems.length
        ? Math.round(allItems.reduce((s, i) => s + Number(i.price), 0) / allItems.length)
        : 0;

    const categories = new Set(allItems.map(i => i.category)).size;

    return (
        <div className="rd-root">
            {/* ── Hero ── */}
            <div className="rd-hero">
                <div className="rd-hero-pattern" aria-hidden="true" />
                <div className="rd-hero-glow" aria-hidden="true" />

                <nav className="rd-navbar">
                    <div className="rd-logo">
                        <img src={logo} alt="HungryHostel logo" className="rd-logo-img" />
                    </div>
                    <div className="rd-nav-actions">
                        <button
                            className="rd-btn-post"
                            onClick={() => navigate("/resturant/listproductaddform")}
                        >
                            + Post Item
                        </button>
                        <button className="rd-btn-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </nav>

                <div className="rd-hero-content">
                    <div className="rd-restaurant-header">
                        <div className="rd-open-badge">
                            <span className="rd-badge-dot" aria-hidden="true" />
                            Open Now
                        </div>
                        {restaurant.isVerified && (
                            <span className="rd-verified-badge" title="Verified Canteen">
                                Verified ✓
                            </span>
                        )}
                    </div>
                    <h1 className="rd-restaurant-name">{restaurant.name}</h1>
                    <div className="rd-restaurant-meta">
                        {restaurant.address && <span>{restaurant.address}</span>}
                        {(restaurant.address && restaurant.mobile) && (
                            <span className="rd-meta-dot" aria-hidden="true">•</span>
                        )}
                        {restaurant.mobile && <span>{restaurant.mobile}</span>}
                        {(restaurant.mobile && restaurant.email) && (
                            <span className="rd-meta-dot" aria-hidden="true">•</span>
                        )}
                        {restaurant.email && <span>{restaurant.email}</span>}
                    </div>
                </div>
            </div>

            {/* ── Stats Bar ── */}
            <div className="rd-stats-bar" role="region" aria-label="Dashboard stats">
                <div className="rd-stat">
                    <div className="rd-stat-number">{allItems.length}</div>
                    <div className="rd-stat-label">Menu Items</div>
                </div>
                <div className="rd-stat">
                    <div className="rd-stat-number">{categories}</div>
                    <div className="rd-stat-label">Categories</div>
                </div>
                <div className="rd-stat">
                    <div className="rd-stat-number">₹{avgPrice}</div>
                    <div className="rd-stat-label">Avg Price</div>
                </div>
                <div className="rd-stat">
                    <div className="rd-stat-number">{orders.length}</div>
                    <div className="rd-stat-label">Total Orders</div>
                </div>
            </div>

            {/* ── Tabs Navigation ── */}
            <div className="rd-tabs-nav" role="tablist">
                <button
                    role="tab"
                    aria-selected={activeTab === "menu"}
                    className={`rd-tab-btn ${activeTab === "menu" ? "active" : ""}`}
                    onClick={() => setActiveTab("menu")}
                >
                    🍔 Menu Items
                </button>
                <button
                    role="tab"
                    aria-selected={activeTab === "orders"}
                    className={`rd-tab-btn ${activeTab === "orders" ? "active" : ""}`}
                    onClick={() => setActiveTab("orders")}
                >
                    📋 Incoming Orders {orders.length > 0 && <span className="rd-orders-badge">{orders.length}</span>}
                </button>
            </div>

            {/* ── Menu Tab ── */}
            {activeTab === "menu" && (
                <div className="rd-body">
                    <div className="rd-section-header">
                        <h2 className="rd-section-title">Menu</h2>
                        <div className="rd-filters" role="group" aria-label="Filter by category">
                            {["all", "breakfast", "lunch", "dinner", "snacks"].map(cat => (
                                <button
                                    key={cat}
                                    className={`rd-filter${activeFilter === cat ? " active" : ""}`}
                                    onClick={() => handleFilter(cat)}
                                >
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="rd-loading" role="status">
                            <div className="rd-spinner" aria-hidden="true" />
                            <p>Loading menu...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="rd-empty">
                            <span className="rd-empty-icon" aria-hidden="true">🍴</span>
                            <p>No items found.</p>
                            <button
                                className="rd-btn-post rd-btn-add-first"
                                onClick={() => navigate("/resturant/listproductaddform")}
                            >
                                + Add your first item
                            </button>
                        </div>
                    ) : (
                        <div className="rd-grid">
                            {filtered.map(item => (
                                <FoodCard
                                    key={item._id}
                                    item={item}
                                    backend={BACKEND}
                                    emojiMap={EMOJI_MAP}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Orders Tab ── */}
            {activeTab === "orders" && (
                <div className="rd-body">
                    <div className="rd-section-header">
                        <h2 className="rd-section-title">Customer Orders</h2>
                        <button className="rd-btn-refresh" onClick={fetchOrders}>
                            🔄 Refresh Orders
                        </button>
                    </div>

                    {orders.length === 0 ? (
                        <div className="rd-empty">
                            <span className="rd-empty-icon" aria-hidden="true">📦</span>
                            <p>No orders placed yet.</p>
                        </div>
                    ) : (
                        <div className="rd-orders-list">
                            {orders.map(order => {
                                const orderDate = new Date(order.createdAt).toLocaleString();
                                return (
                                    <div key={order._id} className="rd-order-card">
                                        <div className="rd-order-header">
                                            <div>
                                                <h3 className="rd-order-id">Order ID: #{order._id.slice(-6).toUpperCase()}</h3>
                                                <span className="rd-order-date">{orderDate}</span>
                                            </div>
                                            <div className="rd-order-status-wrap">
                                                <span className={`rd-status-badge status-${order.status?.toLowerCase() || 'pending'}`}>
                                                    {order.status}
                                                </span>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className="rd-status-select"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Preparing">Preparing</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="rd-order-content">
                                            <div className="rd-customer-info">
                                                <h4 className="rd-sub-title">👤 Customer Details</h4>
                                                <p><strong>Name:</strong> {order.user?.username || "Guest User"}</p>
                                                <p><strong>Mobile:</strong> {order.user?.mobile || "N/A"}</p>
                                                <p><strong>Email:</strong> {order.user?.email || "N/A"}</p>
                                                <p><strong>Delivery Location:</strong> {order.shippingAddress}</p>
                                            </div>

                                            <div className="rd-order-items">
                                                <h4 className="rd-sub-title">🍛 Items Ordered</h4>
                                                <ul className="rd-items-list">
                                                    {order.items.map((item, idx) => (
                                                        <li key={idx} className="rd-order-item">
                                                            <div className="rd-item-details">
                                                                <span className="rd-item-name">{item.name}</span>
                                                                <span className="rd-item-quantity">x{item.quantity}</span>
                                                            </div>
                                                            <span className="rd-item-price">₹{item.price * item.quantity}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="rd-order-total">
                                                    <span>Total Revenue:</span>
                                                    <span className="rd-total-price">₹{order.totalAmount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ── Toast ── */}
            <div
                className={`rd-toast${toast.show ? " show" : ""}`}
                role="status"
                aria-live="polite"
            >
                {toast.msg}
            </div>
        </div>
    );
};

const FoodCard = ({ item, backend, emojiMap, onDelete }) => {
    const [imgError, setImgError] = useState(false);
    const imgSrc = !imgError && item.images?.length
        ? `${backend}/${item.images[0]}`
        : null;
    const emoji = emojiMap[item.category] || "🍽";

    return (
        <article className="rd-card">
            <div className="rd-card-img-wrap">
                {imgSrc ? (
                    <img
                        className="rd-card-img"
                        src={imgSrc}
                        alt={item.name}
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="rd-card-img-placeholder" aria-label={`${item.category} food`}>
                        {emoji}
                    </div>
                )}
                <span className="rd-card-category">{item.category}</span>
                <div className="rd-card-actions">
                    <button
                        className="rd-card-action-btn"
                        aria-label={`Delete ${item.name}`}
                        onClick={() => onDelete(item._id)}
                    >
                        🗑
                    </button>
                </div>
            </div>
            <div className="rd-card-body">
                <h3 className="rd-card-name">{item.name}</h3>
                <p className="rd-card-desc">{item.description}</p>
                <div className="rd-card-footer">
                    <div className="rd-card-price">
                        ₹{item.price}<span>/plate</span>
                    </div>
                    <span className="rd-avail-badge">Available</span>
                </div>
            </div>
        </article>
    );
};

export default RestaurantDashboard;