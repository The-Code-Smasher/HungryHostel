import React from 'react';
import "./CategoryMenu.css";

const CategoryMenu = ({ selectedCategory, onCategoryChange }) => {
  const categories = ["All", "Lunch", "Breakfast", "Dinner", "Snacks"];

  return (
    <div className='food-container'>
        <h3 className='ctg-title'>Category Food</h3>
        <div className='food-ctg'>
            {categories.map((category, index) => {
                const isActive = selectedCategory.toLowerCase() === category.toLowerCase();
                return (
                    <button
                        key={index}
                        className={`ctg-all ${isActive ? "active" : ""}`}
                        onClick={() => onCategoryChange(category)}
                    >
                        {category}
                    </button>
                );
            })}
        </div>
    </div>
  );
};

export default CategoryMenu;