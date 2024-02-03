import React, { useState } from 'react';
import { flightStore } from '../stores/FlightStore';
import { Box, TextField, IconButton, ThemeProvider, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import { searchBarStyle, searchBarTheme } from '../styles/CommonStyle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PhoneIcon from '@mui/icons-material/Phone'; // Import the Phone icon

/**
 * The SearchBar component is responsible for rendering a search input field. 
 * It allows users to enter a search term, which, when changed, triggers a filtering 
 * operation on a flight store to search for and display relevant flight information. 
 */

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [helpOpen, setHelpOpen] = useState(false); // State for managing help dialog visibility

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
        {/* Help Dialog */}
        <Dialog open={helpOpen} onClose={toggleHelpDialog}>
          <DialogTitle>{"Need Help?"}</DialogTitle>
          <DialogContent>
            <Typography>
              Can't find your flight? Let us help you :)
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center" marginTop={2}>
              <PhoneIcon sx={{ mr: 1 }} /> <Typography>Call Us</Typography>
            </Box>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    );
};

export default SearchBar;

