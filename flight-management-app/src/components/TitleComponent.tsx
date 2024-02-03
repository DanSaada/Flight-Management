import React from 'react';
import { Typography, Box } from '@mui/material';
import { titleBoxStyle, mainTitleStyle, subTitleStyle, PlaneIconStyled } from '../styles/CommonStyle';

const TitleComponent = () => {
  return (
    <Box sx={titleBoxStyle}>
      <Typography variant="h2" component="h1" gutterBottom color="primary.main" sx={mainTitleStyle}>
        The Flight Management
      </Typography>
      <Typography variant="h5" color="black" sx={subTitleStyle}>
        Elevate your journey with real-time flight insights
      </Typography>
      <div className="moving-plane">
        <PlaneIconStyled />
      </div>
    </Box>
  );
};

export default TitleComponent;
