import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import { HelpDialogProps } from '../types/Interfaces';

/**
 * The HelpDialog component is a reusable React component designed to provide users with 
 * assistance or additional information. It's implemented as a modal dialog that can be 
 * triggered from various parts of the application where user guidance or support is necessary.
 */

const HelpDialog: React.FC<HelpDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
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
  );
};

export default HelpDialog;
