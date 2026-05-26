import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [status, setStatus] = useState('loading'); // 'loading' | 'auth' | 'unauth'

    useEffect(() => {
        const token     = localStorage.getItem('authToken');
        const loginTime = localStorage.getItem('loginTime');

        if (token && loginTime) {
            const now        = Date.now();
            const expiryTime = parseInt(loginTime, 10) + 7 * 24 * 60 * 60 * 1000;

            if (now < expiryTime) {
                setStatus('auth');
            } else {
                localStorage.removeItem('authToken');
                localStorage.removeItem('loginTime');
                localStorage.removeItem('user');
                setStatus('unauth');
            }
        } else {
            setStatus('unauth');
        }
    }, []);

    if (status === 'loading') {
        return (
            <div className="pr-loading">
                <div className="pr-spinner" aria-label="Loading" />
            </div>
        );
    }

    return status === 'auth' ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;