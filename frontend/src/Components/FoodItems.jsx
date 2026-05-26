import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import FoodCard from './FoodCard';
import './FoodItems.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const FoodItems = ({ selectedCategory, selectedCanteen, searchQuery }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${BACKEND_URL}/products`);
                setAllProducts(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setError('Could not load menu. Make sure the server is running.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Client-side instant filter — no extra network calls
    const displayed = useMemo(() => {
        let items = allProducts;

        if (selectedCanteen && selectedCanteen !== 'All') {
            items = items.filter(p =>
                p.canteen?.toLowerCase() === selectedCanteen.toLowerCase()
            );
        }

        // Only filter by category if there is no search query active (global search override)
        if (!searchQuery?.trim() && selectedCategory && selectedCategory !== 'All') {
            items = items.filter(p =>
                p.category?.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        if (searchQuery?.trim()) {
            const q = searchQuery.trim().toLowerCase();
            items = items.filter(p =>
                p.name?.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.canteen?.toLowerCase().includes(q)
            );
        }

        return items;
    }, [allProducts, selectedCategory, selectedCanteen, searchQuery]);

    if (loading) {
        return (
            <div className="food-loading" role="status">
                <div className="spinner" aria-hidden="true" />
                <p>Loading menu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="food-error">
                <p>{error}</p>
            </div>
        );
    }

    if (displayed.length === 0) {
        return (
            <div className="food-empty">
                <p>
                    {searchQuery
                        ? `No results for "${searchQuery}"`
                        : selectedCategory !== 'All'
                            ? `No ${selectedCategory} items available`
                            : 'No items available yet'}
                </p>
            </div>
        );
    }

    return (
        <div className="food-section">
            <h3 className="section-title">
                {searchQuery
                    ? `Results for "${searchQuery}"`
                    : selectedCategory !== 'All'
                        ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
                        : 'All Items'}
                <span className="item-count">{displayed.length} item{displayed.length !== 1 ? 's' : ''}</span>
            </h3>
            <div className="food-grid">
                {displayed.map(item => (
                    <FoodCard key={item._id} product={item} />
                ))}
            </div>
        </div>
    );
};

export default FoodItems;