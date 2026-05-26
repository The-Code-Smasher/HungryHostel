import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import CategoryMenu from "../Components/CategoryMenu";
import CanteenSelector from "../Components/CanteenSelector";
import "./CustomerDashboard.css";
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
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedCanteen, setSelectedCanteen] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slideImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleSearchInputChange = (val) => {
        setSearchInput(val);
        setSearchQuery(val);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <ToggleSearch searchInput={searchInput} setSearchInput={handleSearchInputChange} />
            <Navbar />
            <div
                className="home-container"
                style={{ backgroundImage: `url(${slideImages[index]})` }}
            >
                <div className="dashboard-content">
                    <h1 className="hungryhst">HUNGRY HOSTEL</h1>
                    <h4 className="slogan">SATISFY YOUR CRAVING WITHIN CAMPUS!</h4>
 
                    <form className="dashboard-search" onSubmit={handleSearchSubmit}>
                        <input
                            className="search"
                            type="search"
                            placeholder="Search food items..."
                            value={searchInput}
                            onChange={(e) => handleSearchInputChange(e.target.value)}
                        />
                        <button type="submit">
                            <FaSearch />
                        </button>
                    </form>
                </div>
            </div>
            <FeatureFoodSlider onCategoryChange={setSelectedCategory} />
            <CanteenSelector selectedCanteen={selectedCanteen} onCanteenChange={setSelectedCanteen} />
            <CategoryMenu
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}/>
            <FoodItems selectedCategory={selectedCategory} selectedCanteen={selectedCanteen} searchQuery={searchQuery}/>
        </>
    );
};

export default CustomerDashBoard;
