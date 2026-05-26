import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./ToggleSearch.css";

const ToggleSearch = ({ searchInput, setSearchInput }) => {
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

  const toggleSearchBar = () => {
    setIsSearchBarOpen(!isSearchBarOpen);
  };

  return (
    <div className="container">
      <div className="search-icon" onClick={toggleSearchBar}>
        <FaSearch />
      </div>

      {isSearchBarOpen && (
        <div className="overlay" onClick={toggleSearchBar}></div>
      )}

      <div className={`search-bar ${isSearchBarOpen ? "open" : ""}`}>
        <input
          type="text"
          placeholder="Search food items..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ToggleSearch;
