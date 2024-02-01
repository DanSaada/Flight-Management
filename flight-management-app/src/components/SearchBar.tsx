import React, { useState } from 'react';
import { flightStore } from '../stores/FlightStore';

/**
 * The SearchBar component is responsible for rendering a search input field. 
 * It allows users to enter a search term, which, when changed, triggers a filtering 
 * operation on a flight store to search for and display relevant flight information. 
 */

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    flightStore.filterFlights(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search flights..."
      value={searchTerm}
      onChange={handleSearch}
    />
  );
};

export default SearchBar;
