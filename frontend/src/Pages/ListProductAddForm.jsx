import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdCurrencyRupee, MdFastfood, MdPhoto } from 'react-icons/md';
import { TbCategory, TbListDetails } from 'react-icons/tb';
import './ListProductAddForm.css';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const ListProductAddForm = () => {
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: '', category: '', price: '', description: '', canteen: '', images: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchCanteenInfo = async () => {
            let storedName = "";
            try {
                const raw = localStorage.getItem('resturant');
                if (raw && raw !== 'undefined') {
                    const parsed = JSON.parse(raw);
                    storedName = parsed?.name;
                }
            } catch (e) {
                console.error("Error parsing stored resturant:", e);
            }

            if (storedName) {
                setProduct(p => ({ ...p, canteen: storedName }));
            } else {
                try {
                    const token = localStorage.getItem('authToken');
                    if (token) {
                        const res = await axios.get(`${BACKEND}/restaurant/dashboard`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (res.data?.restaurant?.name) {
                            setProduct(p => ({ ...p, canteen: res.data.restaurant.name }));
                            localStorage.setItem('resturant', JSON.stringify(res.data.restaurant));
                        }
                    }
                } catch (err) {
                    console.error("Error fetching restaurant info as fallback:", err);
                }
            }
        };
        fetchCanteenInfo();
    }, []);

    const handleChange = e => setProduct({ ...product, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setProduct({ ...product, images: file });
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData();
        Object.entries(product).forEach(([key, val]) => {
            if (val !== null && val !== '') formData.append(key, val);
        });

        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`${BACKEND}/restaurant/listproductaddform`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            navigate('/resturant');
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding product. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lpaf-page">
            <div className="lpaf-card">
                <div className="lpaf-header">
                    <button className="lpaf-back" onClick={() => navigate('/resturant')}>← Back</button>
                    <h2 className="lpaf-title">Add Menu Item</h2>
                </div>

                <form onSubmit={handleSubmit} className="lpaf-form">
                    {/* Image Upload */}
                    <div
                        className="lpaf-img-upload"
                        onClick={() => document.getElementById('imgInput').click()}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && document.getElementById('imgInput').click()}
                        aria-label="Upload food image"
                    >
                        {preview
                            ? <img src={preview} alt="Preview" className="lpaf-preview" />
                            : (
                                <div className="lpaf-img-placeholder">
                                    <MdPhoto size={34} />
                                    <span>Tap to upload photo</span>
                                </div>
                            )
                        }
                        <input
                            id="imgInput"
                            type="file"
                            name="images"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div className="lpaf-group">
                        <MdFastfood className="lpaf-icon" aria-hidden="true" />
                        <input type="text" name="name" placeholder="Food item name" onChange={handleChange} required />
                    </div>

                    <div className="lpaf-group">
                        <TbListDetails className="lpaf-icon" aria-hidden="true" />
                        <input type="text" name="description" placeholder="Short description" onChange={handleChange} required />
                    </div>

                    <div className="lpaf-row">
                        <div className="lpaf-group">
                            <MdCurrencyRupee className="lpaf-icon" aria-hidden="true" />
                            <input type="number" name="price" placeholder="Price" min="1" onChange={handleChange} required />
                        </div>

                        <div className="lpaf-group">
                            <TbCategory className="lpaf-icon" aria-hidden="true" />
                            <select name="category" onChange={handleChange} required defaultValue="">
                                <option value="" disabled>Category</option>
                                <option value="breakfast">Breakfast</option>
                                <option value="lunch">Lunch</option>
                                <option value="dinner">Dinner</option>
                                <option value="snacks">Snacks</option>
                            </select>
                        </div>
                    </div>

                    {/* Canteen is auto-filled and read-only */}
                    <div className="lpaf-group lpaf-readonly">
                        <span className="lpaf-icon" aria-hidden="true">🏠</span>
                        <input
                            type="text"
                            name="canteen"
                            value={product.canteen}
                            readOnly
                            placeholder="Canteen (auto-filled)"
                        />
                    </div>

                    {error && <p className="lpaf-error" role="alert">{error}</p>}

                    <button className="lpaf-submit" type="submit" disabled={loading}>
                        {loading ? <span className="lpaf-spinner" aria-label="Uploading" /> : 'Post Item'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ListProductAddForm;