import React, { useState, useEffect } from 'react';
import { Flight } from '../types/flight';
import { TableRow, TableCell } from '@mui/material';

/**
 * The FlightItem component is a React functional component designed to display detailed 
 * information about a single flight. The details include its flight number, status,
 * scheduled takeoff and landing times, and the airports of departure and arrival.
 */

const FlightItem = ({ flight }: { flight: Flight }) => {
  const [rowStyle, setRowStyle] = useState({});

  useEffect(() => {
    const bgColor = flight.status === 'malfunction' ? '#ffcccb' : 'inherit'; // Light red for malfunction, inherit for others
    setRowStyle({ backgroundColor: bgColor });
  }, [flight.status]); // Update when flight.status changes

  return (
    <TableRow style={rowStyle} sx={{ height: '60px' }}>
      <TableCell align="center">{flight.flightNumber}</TableCell>
      <TableCell align="center">{flight.status}</TableCell>
      <TableCell align="center">{flight.takeoffTime}</TableCell>
      <TableCell align="center">{flight.landingTime}</TableCell>
      <TableCell align="center">{flight.takeoffAirport}</TableCell>
      <TableCell align="center">{flight.landingAirport}</TableCell>
    </TableRow>
  );
};

export default FlightItem;
