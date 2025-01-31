import React, { useState } from "react";
import "./ToggleSearch.css";

const ToggleSearch = () => {
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

  const toggleSearchBar = () => {
    setIsSearchBarOpen(!isSearchBarOpen);
  };

  return (
    <div className="container">
      <i
        className="search-icon fa-solid fa-magnifying-glass"
        onClick={toggleSearchBar}
      ></i>

      {isSearchBarOpen && (
        <div className="overlay" onClick={toggleSearchBar}></div>
      )}

      <div className={`search-bar ${isSearchBarOpen ? "open" : ""}`}>
        <input type="text" placeholder="Search..." />
      </div>
    </div>
  );
};

export default ToggleSearch;
