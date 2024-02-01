import { makeAutoObservable, runInAction } from 'mobx';
import io from 'socket.io-client';
import { Flight } from '../types/flight';

/**
 * The FlightStore class is a MobX store used to manage and store flight-related data in a 
 * React application. It maintains a list of flights, filters flights based on a search term, 
 * and updates flight data in response to real-time events via a WebSocket connection.
 */

class FlightStore {
  flights: Flight[] = [];
  filteredFlights: Flight[] = [];
  currentSearchTerm: string = '';

  constructor() {
    makeAutoObservable(this);
    this.setupSocket();
  }

  setupSocket() {
    const socket = io('http://localhost:4963');
    socket.on('flight-update', (flightUpdate: Partial<Flight>) => {
      this.updateFlight(flightUpdate);
      // Reapply the filter whenever the flights data is updated
      this.filterFlights(this.currentSearchTerm);
    });
  }

  updateFlight(flightUpdate: Partial<Flight>) {
    const index = this.flights.findIndex(f => f.flightNumber === flightUpdate.flightNumber);
    if (index > -1) {
      runInAction(() => {
        this.flights[index] = { ...this.flights[index], ...flightUpdate };
      });
    } else {
      runInAction(() => {
        this.flights.push(flightUpdate as Flight);
      });
    }
  }

  filterFlights(searchTerm: string) {
    this.currentSearchTerm = searchTerm; // Store the current search term
    if (!searchTerm.trim()) {
      // If the search term is empty, show all flights
      this.filteredFlights = this.flights;
    } else {
      // Convert the search term to lower case for case-insensitive comparison
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      this.filteredFlights = this.flights.filter(flight =>
        flight.flightNumber.toLowerCase().includes(lowerCaseSearchTerm) ||
        flight.takeoffAirport.toLowerCase().includes(lowerCaseSearchTerm) ||
        flight.landingAirport.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
  }

  // Getter to decide which flights to show based on whether there's a search term
  get visibleFlights() {
    return this.currentSearchTerm ? this.filteredFlights : this.flights;
  }
}

export const flightStore = new FlightStore();
