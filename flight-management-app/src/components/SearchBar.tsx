import React, { useState } from 'react';
import { flightStore } from '../stores/FlightStore';
import { Box, TextField, IconButton, ThemeProvider } from '@mui/material';
import { searchBarStyle, searchBarTheme } from '../styles/CommonStyle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HelpDialog from './HelpDialog';

/**
 * The SearchBar component is responsible for rendering a search input field. 
 * It allows users to enter a search term, which, when changed, triggers a filtering 
 * operation on a flight store to search for and display relevant flight information. 
 */

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [helpOpen, setHelpOpen] = useState(false);

    // Function to handle with the user search term
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      flightStore.filterFlights(event.target.value);
    };

    // Toggle the help dialog
    const toggleHelpDialog = () => {
      setHelpOpen(!helpOpen);
    };
  
    return (
      <ThemeProvider theme={searchBarTheme}>
        <Box sx={{ ...searchBarStyle, display: 'flex', alignItems: 'center' }}>
          <TextField
            type="text"
            placeholder="Search flights..."
            value={searchTerm}
            onChange={handleSearch}
            fullWidth
            label="Search Flights"
            variant="outlined"
            sx={{
              maxWidth: 'calc(100% - 48px)', // Adjust size to leave space for the icon button
            }}
          />
          <IconButton onClick={toggleHelpDialog} sx={{ ml: 1 }}>
            <HelpOutlineIcon />
          </IconButton>
        </Box>
        <HelpDialog open={helpOpen} onClose={toggleHelpDialog} />
      </ThemeProvider>
    );
};

export default SearchBar;

