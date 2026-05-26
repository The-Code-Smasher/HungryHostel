import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CanteenSelector.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const CanteenSelector = ({ selectedCanteen, onCanteenChange }) => {
    const [canteens, setCanteens] = useState([]);

    useEffect(() => {
        const fetchCanteens = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/restaurants`);
                setCanteens(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Error fetching canteens:", err);
            }
        };
        fetchCanteens();
    }, []);

    return (
        <div className="canteen-selector-container">
            <h3 className="cs-title">Canteens on Campus</h3>
            <div className="cs-list">
                <button
                    className={`cs-card ${selectedCanteen === 'All' ? 'active' : ''}`}
                    onClick={() => onCanteenChange('All')}
                >
                    <span className="cs-emoji">🍴</span>
                    <span className="cs-name">All Canteens</span>
                </button>
                {canteens.map((canteen) => {
                    const isActive = selectedCanteen.toLowerCase() === canteen.name.toLowerCase();
                    return (
                        <button
                            key={canteen._id}
                            className={`cs-card ${isActive ? 'active' : ''}`}
                            onClick={() => onCanteenChange(canteen.name)}
                        >
                            <span className="cs-emoji">🏫</span>
                            <div className="cs-info">
                                <span className="cs-name">
                                    {canteen.name}
                                    {canteen.isVerified && <span className="cs-verified" title="Verified Canteen">✓</span>}
                                </span>
                                <span className="cs-address">{canteen.address || "Campus"}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CanteenSelector;
