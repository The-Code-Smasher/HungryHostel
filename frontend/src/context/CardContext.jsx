import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : {};
    });

    
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);
    
    const getTotalCount = () => {
        return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
    };

    const addToCart = (id, price) => {
        setCart((prevCart) => ({
            ...prevCart,
            [id]: {
                quantity: (prevCart[id]?.quantity || 0) + 1,
                price,
            },
        }));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) {
            removeFromCart(id);
        } else {
            setCart((prevCart) => ({
                ...prevCart,
                [id]: {
                    ...prevCart[id],
                    quantity,
                },
            }));
        }
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };
            delete updatedCart[id];
            return updatedCart;
        });
    };

    const calculateTotal = () => {
        return Object.values(cart).reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            calculateTotal,
            getTotalCount
        }}>
            {children}
        </CartContext.Provider>
    );
};