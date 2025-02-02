import React from 'react';
import "./ResturantDashboard.css";
import chole from "../assets/chole.png";
import image from "../assets/image.jpeg";

const RestaurantDashboard = () => {
  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <img src={chole} alt="Restaurant Logo" />
        <div className="nav-buttons">
          <button className="post">Post</button>
          <button className="logout">Logout</button>
        </div>
      </div>

      {/* Main Container */}
      <div className="container">
        <h1>Welcome, Restaurant Owner!</h1>
        <br />

        {/* Restaurant Info Section */}
        <div className="restaurant-container">
          <img src={image} alt="Restaurant Image" className="restaurant-img" />
          <div className="restaurant-text">
            <h2>Restaurant Name</h2>
            <p>Best place to enjoy delicious meals!</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button className="f_buttons">All</button>
          <button className="f_buttons">Lunch</button>
          <button className="f_buttons">Breakfast</button>
          <button className="f_buttons">Dinner</button>
        </div>

        {/* Food Card */}
        <div className="food-card">
          <img src={chole} alt="Posted Food" />
          <h3>Delicious Meal</h3>
          <p>Description of the food item goes here. Ingredients, taste, and more details.</p>
          <p><strong>Price: $10</strong></p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;