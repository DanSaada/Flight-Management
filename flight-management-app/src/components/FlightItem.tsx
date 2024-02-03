import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite'; // Import observer from mobx-react-lite
import { Flight } from '../types/Interfaces';
import { TableRow, TableCell, Typography, Tooltip } from '@mui/material';
import { getFlightItemStyle, textCellStyle, getStatusStyle } from '../styles/CommonStyle';
import { flightStore } from '../stores/FlightStore'; // Assuming this is your store

/**
 * The FlightItem component is a React functional component designed to display detailed 
 * information about a single flight. The details include its flight number, status,
 * scheduled takeoff and landing times, and the airports of departure and arrival.
 */

const FlightItem = observer(({ flight, index }: { flight: Flight, index: number }) => {
  const [takeoffDelay, setTakeoffDelay] = useState<number | null>(null);
  const [landingDelay, setLandingDelay] = useState<number | null>(null);

  useEffect(() => {
    // Check if there's an entry for the current flight in the delayTimes hashmap
    const flightDelayInfo = flightStore.delayTimes[flight.flightNumber];
    
    // Safely access takeoffDelay, defaulting to 0 if not present
    const newTakeoffDelay = flightDelayInfo ? flightDelayInfo.takeoffDelay : 0;
    setTakeoffDelay(newTakeoffDelay);
  }, [flight.flightNumber, flight.takeoffDelay]);
  

useEffect(() => {
  // Check if there's an entry for the current flight in the delayTimes hashmap
  const flightDelayInfo = flightStore.delayTimes[flight.flightNumber];
  
  // Safely access landingDelay, defaulting to 0 if not present
  const newLandingDelay = flightDelayInfo ? flightDelayInfo.landingDelay : 0;
  setLandingDelay(newLandingDelay);
}, [flight.flightNumber, flight.landingDelay]);


  const renderDelayCell = (delay: number) => {
    return delay > 0 ? (
      <Tooltip title={`Delayed by ${delay} minutes`}>
        <span>{delay}m</span>
      </Tooltip>
    ) : (
      '-'
    );
  };

  const rowStyle = getFlightItemStyle(index);
  const text = textCellStyle;
  const statusStyle = getStatusStyle(flight.status);

  return (
    <TableRow sx={rowStyle}>
      <TableCell sx={text}><Typography>{flight.flightNumber}</Typography></TableCell>
      <TableCell align="center" sx={statusStyle}>{flight.status}</TableCell>
      <TableCell sx={text}>{flight.takeoffTime}</TableCell>
      <TableCell sx={text}>{renderDelayCell(takeoffDelay? takeoffDelay:0)}</TableCell>
      <TableCell sx={text}>{flight.landingTime}</TableCell>
      <TableCell sx={text}>{renderDelayCell(landingDelay? landingDelay:0)}</TableCell>
      <TableCell sx={text}>{flight.takeoffAirport}</TableCell>
      <TableCell sx={text}>{flight.landingAirport}</TableCell>
    </TableRow>
  );
});

export default FlightItem;
