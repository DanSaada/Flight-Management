import React from 'react';
import { Typography, Box } from '@mui/material';

const TitleComponent = () => {
  return (
    <Box textAlign="center" mb={5}>
      <Typography variant="h2" component="h1" gutterBottom color="primary.main" style={{ fontWeight: 'bold' }}>
        The Flight Management
      </Typography>
      <Typography variant="h5" color="black">
        Elevate your journey with real-time flight insights
      </Typography>
    </Box>
  );
};

export default TitleComponent;
