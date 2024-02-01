import React from 'react';
import { Flight } from '../types/flight';

/**
 * The FlightItem component is a React functional component designed to display detailed 
 * information about a single flight. The details include its flight number, status,
 * scheduled takeoff and landing times, and the airports of departure and arrival.
 */

const FlightItem = ({ flight }: { flight: Flight }) => (
  <div style={{ backgroundColor: flight.status === 'malfunction' ? 'red' : 'white' }}>
    <div>{flight.flightNumber}</div>
    <div>{flight.status}</div>
    <div>{flight.takeoffTime}</div>
    <div>{flight.landingTime}</div>
    <div>{flight.takeoffAirport}</div>
    <div>{flight.landingAirport}</div>
  </div>
);

export default FlightItem;