import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const loginTime = localStorage.getItem("loginTime");

        if (token && loginTime) {
            const now = new Date().getTime();
            const expiryTime = parseInt(loginTime) + 24 * 60 * 60 * 1000; 

            if (now < expiryTime) {
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem("authToken");
                localStorage.removeItem("loginTime");
            }
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
