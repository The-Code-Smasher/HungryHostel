import React, { useState } from "react";
import { FaCircle, FaSearch } from "react-icons/fa";
import "./Navbar.css";
import { useCart } from "../context/CardContext";
import Logo from "../assets/logo.png";
import Basket from "../assets/purchase.png";

const Navbar = () => {
    const { getTotalCount } = useCart();
    const totalItems = getTotalCount();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleCartClick = () => {
        setIsCartOpen(!isCartOpen);
    };

    return (
        <>
            <div className="navbar">
                <div className="logo">
                    <img src={Logo} alt="logo" width={100} />
                </div>
                <div className="search">
                    <input type="search" placeholder="Search" />
                    <button>
                        <FaSearch />
                    </button>
                </div>
                <div>
                    <span className="shopping-bsk cart-icon" onClick={handleCartClick}>
                        <img src={Basket} alt="Basket" height={50} width={50} />
                        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                    </span>
                    <span className="profile">
                        <FaCircle />
                    </span>
                </div>
            </div>

            {/* Cart popup appears when isCartOpen is true */}
            {isCartOpen && <Cart onClose={() => setIsCartOpen(false)} />}
        </>
    );
};

export default Navbar;
