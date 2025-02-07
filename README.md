<h1 align="center">HUNGRY HOSTEL</h1>

<p align="center">
  <a href="https://weekendofcode.computercodingclub.in/">
    <img src="https://i.postimg.cc/Z9fC676j/devjam.jpg" height=30px>
  </a>
</p>

## Introduction
HungryHostel.com is a food discovery platform designed specifically for college students. Like Zomato, it helps users explore nearby restaurants, cafes, and food vendors, but it is restricted to a college range. Students can browse menus, check reviews, and place orders from eateries within or around their campus, making it easier to find good food without leaving the college area.

## Table of Contents
- [Folder Structure](#folder-structure)
- [Technology Stack](#technology-stack)
- [Contributors](#contributors)
- [Made At](#made-at)

## Folder Structure

```
Hungry Hostel (Project Structure)

├── backend                               # Server-side (Node.js, Express, MongoDB)
│   ├── config                            # Configuration files
│   │   └── db.js                         # Database connection setup
│   ├── index.js                          # Main server entry point
│   ├── models                            # Mongoose schemas
│   │   ├── order.js                      # Order schema
│   │   ├── product.js                    # Product schema
│   │   ├── restaurant.js                 # Restaurant schema
│   │   └── user.js                       # User schema
│   ├── routes                            # API routes
│   │   └── userRoutes.js                 # Routes for user authentication
│   ├── uploads                           # Stores uploaded images
│   │   ├── *images*                      # Various uploaded food and user images
│   ├── package.json                      # Backend dependencies
│   ├── package-lock.json                 # Backend dependency lock file
├── frontend                              # Client-side (React, Vite)
│   ├── Favicon.png                       # Site favicon
│   ├── README.md                         # Frontend documentation
│   ├── eslint.config.js                  # ESLint configuration
│   ├── index.html                        # Root HTML file
│   ├── package.json                      # Frontend dependencies
│   ├── package-lock.json                 # Frontend dependency lock file
│   ├── public/                           # Static assets
│   ├── src/                              # React source files
│   │   ├── App.jsx                       # Main app component
│   │   ├── App.css                       # Global styles
│   │   ├── index.css                     # Main CSS file
│   │   ├── main.jsx                      # Entry point for React
│   │   ├── Components/                   # Reusable UI components
│   │   │   ├── Auth/                     # Authentication-related components
│   │   │   │   ├── Login.jsx             # User login form
│   │   │   │   ├── Login.css             # Styles for login form
│   │   │   │   ├── ResturantLogin.jsx    # Restaurant login form
│   │   │   │   └── Register.jsx          # User registration form
│   │   │   ├── Navbar.jsx                # Navbar
│   │   │   ├── Navbar.css                # Navbar styles
│   │   │   ├── Card.jsx                  # Food item Cart
│   │   │   ├── Card.css                  # Styles for Cart
│   │   │   ├── CategoryMenu.jsx          # Category menu for filtering items
│   │   │   ├── FeatureFoodSilde.jsx      # Featured food slider
│   │   │   ├── Profile.jsx               # User profile page
│   │   │   ├── ToggleSearch.jsx          # Search toggle bar
│   │   │   ├── payment/                  # Payment-related components
│   │   │   │   ├── payment.jsx           # Payment page
│   │   │   │   ├── payment.css           # Payment styles
│   │   ├── Pages/                        # Page-level components
│   │   │   ├── CustomerDashboard.jsx     # Dashboard for customers
│   │   │   ├── ResturantDashboard.jsx    # Dashboard for restaurant owners
│   │   │   ├── ListProductAddForm.jsx    # Form to list new food items
│   │   ├── assets/                       # Images and icons
│   │   │   ├── *food images, icons, logo*
│   │   ├── context/                      # Global state management
│   │   │   └── CardContext.jsx           # Context for managing cart items
│   │   ├── ProtectedRoute.jsx            # Route protection for authenticated users
│   │   ├── ResturantProtectedRoute.jsx   # Route protection for restaurants
│   ├── vite.config.js                    # Vite configuration
├── README.md                             # Project documentation
├── package.json                          # Root-level dependencies and scripts
├── package-lock.json                     # Dependency lock file
```

## Technology Stack
- React
- Express.js
- MongoDB
- Node.js

## Contributors

**Team Name: Hungry Hostel**

- [Karan Chauhan](https://github.com/karan-chauhan0)
- [Hrithik Parihar](https://github.com/parihar2002)
- [Amita Singh](https://github.com/amita-singh01)
- [Sakshi Jain](https://github.com/SakshiCA088)

## Made At

<p align="center">
  <a href="https://weekendofcode.computercodingclub.in/">
    <img src="https://i.postimg.cc/Z9fC676j/devjam.jpg" height=30px>
  </a>
</p>
