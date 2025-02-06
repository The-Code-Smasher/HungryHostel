import React, { useState } from "react";
import { FaCircle } from "react-icons/fa";
import "./Navbar.css";
import { useCart } from "../context/CardContext";
import Logo from "../assets/logo.png";
import Basket from "../assets/purchase.png";
import Cart from "./Card";
import Profile from "./Profile";

const Navbar = () => {
    const { getTotalCount } = useCart();
    const totalItems = getTotalCount();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false);

    const handleCartClick = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleProfileClick = () => {
        setProfileOpen(!isProfileOpen);
    };

    return (
        <>
            <div className="navbar">
                <div className="navbar-content">
                    <div className="logo">
                        <img src={Logo} alt="logo" />
                    </div>

                    <div className="nav-icons">
                        <span className="shopping-bsk cart-icon" onClick={handleCartClick}>
                            <img src={Basket} alt="Basket" height={50} width={50} />
                            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                        </span>
                        <span className="profile" onClick={handleProfileClick}>
                            <FaCircle />
                        </span>
                    </div>
                </div>
            </div>

            {isCartOpen && <Cart onClose={() => setIsCartOpen(false)} />}
            {isProfileOpen && <Profile onClose={() => setProfileOpen(false)} />}
        </>
    );
};

export default Navbar;