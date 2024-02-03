import React from 'react';
import { Typography, Box } from '@mui/material';
import { titleBoxStyle, mainTitleStyle, subTitleStyle } from '../styles/CommonStyle';

const TitleComponent = () => {
  return (
    <Box sx={titleBoxStyle}>
      <Typography variant="h2" component="h1" gutterBottom color="primary.main" sx={mainTitleStyle}>
        The Flight Management
      </Typography>
      <Typography variant="h5" color="black" sx={subTitleStyle}>
        Elevate your journey with real-time flight insights
      </Typography>
    </Box>
  );
};

export default TitleComponent;
