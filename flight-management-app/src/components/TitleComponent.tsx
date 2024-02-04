import React from 'react';
import { Typography, Box } from '@mui/material';
import { titleBoxStyle, mainTitleStyle, subTitleStyle, PlaneIconStyled } from '../styles/CommonStyle';

const TitleComponent = () => {
  return (
    <Box sx={titleBoxStyle}>
      <Typography variant="h2" component="h1" gutterBottom color="primary.main" sx={mainTitleStyle}>
        The Flight Management
      </Typography>
      <Box sx={{ position: 'relative', ...subTitleStyle }}>
        <Typography variant="h5" color="black">
          Elevate your journey with real-time flight insights
        </Typography>
        <Box className="moving-plane" sx={{ position: 'absolute', top: '50px', left: '8%', transform: 'translateX(-50%)' }}>
          <PlaneIconStyled />
        </Box>
      </Box>
    </Box>
  );
};

export default TitleComponent;
