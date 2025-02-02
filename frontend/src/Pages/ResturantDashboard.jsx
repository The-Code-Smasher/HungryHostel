import React from 'react'

const ResturantDashboard = () => {
  return (
    <div>
         <div class="navbar">
        <img src="chole.png" alt="Restaurant Logo">
        <div class="nav-buttons">
            <button class="post">Post</button>
            <button class="logout">Logout</button>
        </div>
    </div>
    <div class="container">
        <h1>Welcome, Restaurant Owner!</h1>
        <br>
        <div class="restaurant-container">
            <img src="image.jpeg" alt="Restaurant Image" class="restaurant-img">
            <div class="restaurant-text">
                <h2>Restaurant Name</h2>
                <p>Best place to enjoy delicious meals!</p>
            </div>
        </div>
        <div class="filter-buttons">
            <button class="f_buttons">All</button>
            <button class="f_buttons">Lunch</button>
            <button class="f_buttons">Breakfast</button>
            <button class="f_buttons">Dinner</button>
        </div>
        
        <div class="food-card">
            <img src="chole.png" alt="Posted Food">
            <h3>Delicious Meal</h3>
            <p>Description of the food item goes here. Ingredients, taste, and more details.</p>
            <p><strong>Price: $10</strong></p>
        </div>
    </div>

    </div>
  )
}

export default ResturantDashboard