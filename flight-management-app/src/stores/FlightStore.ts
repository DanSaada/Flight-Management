import { makeAutoObservable, runInAction } from 'mobx';
import io from 'socket.io-client';
import { Flight } from '../types/flight';
import { fetchAllFlights, fetchFlightByNumber } from '../services/Api';

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
    this.loadAllFlights(); // Fetch all flights upon store initialization
  }

  setupSocket() {
    const socket = io('http://localhost:4963');
    socket.on('flight-update', (flightUpdate: Partial<Flight>) => {
      runInAction(() => {
        const index = this.flights.findIndex(f => f.flightNumber === flightUpdate.flightNumber);
        if (index > -1) {
          this.flights[index] = { ...this.flights[index], ...flightUpdate };
        } else {
          this.flights.push(flightUpdate as Flight);
        }
        // Reapply the filter whenever the flights data is updated
        this.filterFlights(this.currentSearchTerm);
      });
    });
  }

  async loadAllFlights() {
    try {
      const flights = await fetchAllFlights();
      runInAction(() => {
        this.flights = flights;
        // Reapply the filter to the newly fetched flights
        this.filterFlights(this.currentSearchTerm);
      });
    } catch (error) {
      console.error("Could not load flights", error);
    }
  }

  async loadFlightByNumber(flightNumber: string) {
    try {
      const flight = await fetchFlightByNumber(flightNumber);
      runInAction(() => {
        // Update or add the specific flight in the flights array
        const index = this.flights.findIndex(f => f.flightNumber?.toLowerCase() === JSON.stringify(flight.flightNumber?.toLowerCase()));
        if (index > -1) {
          this.flights[index] = flight;
        } else {
          this.flights.push(flight);
        }
      });
      return flight; // Return the loaded flight
    } catch (error) {
      console.error(`Could not load flight ${flightNumber}`, error);
      return null;
    }
  }

  async filterFlights(searchTerm: string) {
    this.currentSearchTerm = searchTerm; // Store the current search term
    if (!searchTerm.trim()) {
      // If the search term is empty, reset to show all flights
      this.loadAllFlights();
    } else {
      // For other search terms, filter client-side
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      runInAction(() => {
        this.filteredFlights = this.flights.filter(flight =>
          flight.flightNumber?.toLowerCase().includes(lowerCaseSearchTerm) ||
          flight.takeoffAirport?.toLowerCase().includes(lowerCaseSearchTerm) ||
          flight.landingAirport?.toLowerCase().includes(lowerCaseSearchTerm)
        );
      });
    }
  }
  

  // Getter to decide which flights to show based on whether there's a search term
  get visibleFlights() {
    return this.currentSearchTerm ? this.filteredFlights : this.flights;
  }
}

export const flightStore = new FlightStore();
