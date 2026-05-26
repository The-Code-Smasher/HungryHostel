import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try{
            const savedCart = localStorage.getItem("cart");
            return savedCart ? JSON.parse(savedCart) : {};
        }catch{
            return {};
        }
    });


    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const getTotalCount = () => {
        return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
    };

    const addToCart = (productId, price, name) => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };

            if (updatedCart[productId]) {
                updatedCart[productId].quantity += 1;
            } else {
                updatedCart[productId] = { quantity: 1, price, name }; // Add new product
            }

            return updatedCart;
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        setCart((prevCart) => {
            const updated = { ...prevCart };
            if (newQuantity <= 0) {
                delete updated[productId];
            } else if (updated[productId]) {
                updated[productId] = { ...updated[productId], quantity: newQuantity };
            }
            return updated;
        });
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };
            delete updatedCart[id];
            return updatedCart;
        });
    };

    const clearCart = () => setCart({});

    const calculateTotal = () => Object.values(cart).reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            calculateTotal,
            getTotalCount
        }}>
            {children}
        </CartContext.Provider>
    );
};