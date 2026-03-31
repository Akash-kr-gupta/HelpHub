// src/components/Filter.js
import React, { useState } from "react";

// For HelpHub: filter by type, status, and search text
const Filter = ({ onFilterChange, defaultFilters = {} }) => {
  const [filters, setFilters] = useState({
    type: defaultFilters.type || "all",           // food, clothes, medicine, blood, animal, etc.
    status: defaultFilters.status || "all",        // Pending, Completed, etc.
    searchText: defaultFilters.searchText || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filter-controls" style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          abel>Type:</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
          >
            <option value="all">All Types</option>
            <option value="food">Food</option>
            <option value="clothes">Clothes</option>
            <option value="medicine">Medicine</option>
            <option value="blood">Blood</option>
            <option value="animal_rescue">Animal Rescue</option>
            <option value="general">General Help</option>
          </select>
        </div>

        <div>
          abel>Status:</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        <div>
          abel>Search:</label>
          <input
            type="text"
            name="searchText"
            value={filters.searchText}
            onChange={handleChange}
            placeholder="Search by description, location..."
          />
        </div>
      </div>
    </div>
  );
};

export default Filter;