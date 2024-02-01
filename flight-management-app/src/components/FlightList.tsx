import React from 'react';
import { observer } from 'mobx-react';
import { flightStore } from '../stores/FlightStore';
import FlightItem from './FlightItem';

/**
 * The FlightList component is a functional component that uses the observer function 
 * from MobX to become reactive. This means the component will automatically re-render 
 * if any of the observables (in this case, flightStore.flights) used within it change.
 */

const FlightList = observer(() => (
  <div>
    {flightStore.flights.map(flight => (
      <FlightItem key={flight.flightNumber} flight={flight} />
    ))}
  </div>
));

export default FlightList;
