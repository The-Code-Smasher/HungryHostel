import React from 'react';
import "./CategoryMenu.css";

const CategoryMenu = () => {
  const categories = ["All", "Lunch", "Breakfast", "Dinner", "Snacks"];

  return (
    <div className='food-container'>
        <h3 className='ctg-title'>Category Food</h3>
        <div className='food-ctg'>
            {categories.map((category, index) => (
                <button key={index} className="ctg-all">{category}</button>
            ))}
        </div>
    </div>
  );
}

export default CategoryMenu;