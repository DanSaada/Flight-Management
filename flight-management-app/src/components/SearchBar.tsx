import React, { useState } from 'react';
import { flightStore } from '../stores/FlightStore';
import { TextField, Box } from '@mui/material';
import commonStyles from '../styles/CommonStyle';

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
    <Box sx={commonStyles.stickySearchBar}>
      <TextField
        type="text"
        placeholder="Search flights..."
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        label="Search Flights"
        variant="outlined"
        sx={{
          maxWidth: '100%', // Ensure TextField does not exceed the Box width
        }}
      />
    </Box>
  );
};

export default SearchBar;
