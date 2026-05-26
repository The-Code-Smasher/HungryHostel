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
    const [restaurant, setRestaurant] = useState({ name: "Campus Kitchen", address: "", mobile: "" });

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("resturant") || "{}");
        if (stored?.name) setRestaurant(stored);
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND}/products`);
            const data = await res.json();
            const items = Array.isArray(data) ? data : [];
            setAllItems(items);
            setFiltered(items);
        } catch {
            setAllItems([]);
            setFiltered([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = (cat) => {
        setActiveFilter(cat);
        setFiltered(cat === "all" ? allItems : allItems.filter(i => i.category === cat));
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${BACKEND}/products/${id}`, { method: "DELETE" });
        } catch { /* silent fail */ }
        const updated = allItems.filter(i => i._id !== id);
        setAllItems(updated);
        setFiltered(activeFilter === "all" ? updated : updated.filter(i => i.category === activeFilter));
        showToast("Item removed from menu");
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
                    <div className="rd-open-badge">
                        <span className="rd-badge-dot" aria-hidden="true" />
                        Open Now
                    </div>
                    <h1 className="rd-restaurant-name">{restaurant.name}</h1>
                    <div className="rd-restaurant-meta">
                        {restaurant.address && <span>{restaurant.address}</span>}
                        {restaurant.address && restaurant.mobile && (
                            <span className="rd-meta-dot" aria-hidden="true">•</span>
                        )}
                        {restaurant.mobile && <span>{restaurant.mobile}</span>}
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
                    <div className="rd-stat-number">4.6 ★</div>
                    <div className="rd-stat-label">Rating</div>
                </div>
            </div>

            {/* ── Body ── */}
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