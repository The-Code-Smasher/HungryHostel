import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import CategoryMenu from "../Components/CategoryMenu";
import "./CustomerDashBoard.css";
import FoodItems from "../Components/FoodItems";
import FeatureFoodSlider from "../Components/FeatureFoodSilder";
import ToggleSearch from "../Components/ToggleSearch";
import { FaSearch } from "react-icons/fa";

import img1 from "../assets/slider1.jpg";
import img2 from "../assets/slider2.jpg";
import img3 from "../assets/slider3.jpg";

const slideImages = [img1, img2, img3];

const CustomerDashBoard = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % slideImages.length);
        }, 2000); // 2 seconds per image

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <ToggleSearch />
            <Navbar />
            <div
                className="home-container"
                style={{ backgroundImage: `url(${slideImages[index]})` }}
            >
                <div className="dashboard-content">
                    <h1 className="hungryhst">HUNGRY HOSTEL</h1>
                    <h4 className="slogan">SATISFY YOUR CRAVING WITHIN CAMPUS!</h4>

                    <div className="dashboard-search">
                        <input className="search" type="search" placeholder="Search food items..." />
                        <button>
                            <FaSearch />
                        </button>
                    </div>
                </div>
            </div>
            <FeatureFoodSlider />
            <CategoryMenu />
            <FoodItems />
        </>
    );
};

export default CustomerDashBoard;



