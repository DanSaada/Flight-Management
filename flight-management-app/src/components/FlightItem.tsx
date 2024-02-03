import React, { useState, useEffect } from 'react';
import { Flight } from '../types/flight';
import { TableRow, TableCell, Typography } from '@mui/material';
import { grey, red } from '@mui/material/colors';
import { Tooltip } from '@mui/material'

/**
 * The FlightItem component is a React functional component designed to display detailed 
 * information about a single flight. The details include its flight number, status,
 * scheduled takeoff and landing times, and the airports of departure and arrival.
 */

const FlightItem = ({ flight, index }: { flight: Flight, index: number }) => {
  const [takeoffDelay, setTakeoffDelay] = useState<number | null>(null);
  const [landingDelay, setLandingDelay] = useState<number | null>(null);

  useEffect(() => {
    // Calculate and update takeoff delay only if previous takeoff time is available
    if (flight.previousTakeoffTime) {
      const newTakeoffDelay = flight.takeoffDelay;
      setTakeoffDelay(newTakeoffDelay);
    }
  }, [flight.takeoffDelay]);

  useEffect(() => {
    // Calculate and update landing delay only if previous landing time is available
    if (flight.previousLandingTime) {
      const newLandingDelay = flight.landingDelay;
      setLandingDelay(newLandingDelay);
    }
  }, [flight.landingDelay]);
  

  // Function to render delay cell
  const renderDelayCell = (delay: number) => {
    return delay > 0 ? (
      <Tooltip title={`Delayed by ${delay} minutes`}>
        <span>{delay}m</span>
      </Tooltip>
    ) : (
      '-'
    );
  };


  // Define the row style based on the index for striped effect
  const rowStyle = {
    color: 'white',
    backgroundColor: index % 2 ? grey[900] : grey[800],
     // Set text color to white for all cells
    '&:hover': {
      backgroundColor: grey[700], // or any other color for hover state
    },
  };
  const text = {color: 'white', textAlign: 'center',};
  const statusStyle = flight.status === 'malfunction' ? { color: red[500] } : {color: 'white'};

  return (
    <TableRow sx={rowStyle}>
      <TableCell sx={text}><Typography>{flight.flightNumber}</Typography></TableCell>
      <TableCell align="center" sx={statusStyle}>{flight.status}</TableCell>
      <TableCell sx={text}>{flight.takeoffTime}</TableCell>
      <TableCell sx={text}>{renderDelayCell(takeoffDelay ? takeoffDelay : 0)}</TableCell>
      <TableCell sx={text}>{flight.landingTime}</TableCell>
      <TableCell sx={text}>{renderDelayCell(landingDelay ? landingDelay : 0)}</TableCell>
      <TableCell sx={text}>{flight.takeoffAirport}</TableCell>
      <TableCell sx={text}>{flight.landingAirport}</TableCell>
    </TableRow>
  );
};

export default FlightItem;
