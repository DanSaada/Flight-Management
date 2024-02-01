import React from 'react';
import { observer } from 'mobx-react';
import { flightStore } from '../stores/FlightStore';
import dynamic from 'next/dynamic';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

/**
 * The FlightList component is a functional component that uses the observer function 
 * from MobX to become reactive. This means the component will automatically re-render 
 * if any of the observables (in this case, flightStore.flights) used within it change.
 */

const FlightItem = dynamic(() => import('./FlightItem'), { ssr: false });

const FlightList = observer(() => (
  <TableContainer component={Paper} sx={{ maxWidth: '88%', mx: 'auto', mt: 2 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center">Flight Number</TableCell>
          <TableCell align="center">Status</TableCell>
          <TableCell align="center">Takeoff Time</TableCell>
          <TableCell align="center">Landing Time</TableCell>
          <TableCell align="center">Takeoff Airport</TableCell>
          <TableCell align="center">Landing Airport</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {flightStore.visibleFlights.map(flight => (
          <FlightItem key={flight.flightNumber} flight={flight} />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
));

export default FlightList;
