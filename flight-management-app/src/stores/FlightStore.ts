import { makeAutoObservable, runInAction } from 'mobx';
import io from 'socket.io-client';
import { Flight, DelayTimes} from '../types/Interfaces';
import { fetchAllFlights, fetchFlightByNumber } from '../services/Api';
import moment from 'moment';
import { set } from 'mobx';

/**
 * The FlightStore class is a MobX store used to manage and store flight-related data in a 
 * React application. It maintains a list of flights, filters flights based on a search term, 
 * and updates flight data in response to real-time events via a WebSocket connection.
 */

class FlightStore {
  flights: Flight[] = [];
  filteredFlights: Flight[] = [];
  currentSearchTerm: string = '';
  initialLoadComplete: boolean = false;
  delayTimes: Record<string, DelayTimes> = {}; // Maps flight numbers to delay times in minutes

  constructor() {
    makeAutoObservable(this);
    this.loadAllFlights();
    this.setupSocket();
  }

    // Function to calculate delay in minutes
    calculateDelay = (current: string, previous?: string, flightNumber?: string, flag?: boolean) => {
      const currentTime = moment(current, "DD/MM/YYYY - HH:mm");
      const previousTime = moment(previous || current, "DD/MM/YYYY - HH:mm");
      const delay = currentTime.diff(previousTime, 'minutes');
      if (delay >= 120) {
        this.initialLoadComplete = false;
        this.loadAllFlights();
      } else if (flightNumber) {
        // Check if the flightNumber entry exists, if not, initialize it properly
        if (!this.delayTimes[flightNumber]) {
          set(this.delayTimes, flightNumber, { takeoffDelay: 0, landingDelay: 0 });
        }
    
        // Change the delay times according to the flag
        if (flag) {
          set(this.delayTimes[flightNumber], 'takeoffDelay', delay);
        } else {
          set(this.delayTimes[flightNumber], 'landingDelay', delay);
        }
      }
    };

  // Function to get flights updates from the server in a web socket manner
  async setupSocket() {
    const socket = io('http://localhost:4963');
    socket.on('flight-update', (flightUpdate: Partial<Flight>) => {
      runInAction(() => {
        const index = this.flights.findIndex(f => f.flightNumber === flightUpdate.flightNumber);
        if (index > -1) { // flight was found
          const currentFlight = this.flights[index];
          
          // Apply status updates
          if (flightUpdate.status !== undefined && flightUpdate.status !== currentFlight.status) {
              this.flights[index] = { ...currentFlight, status: flightUpdate.status };
          }
          else if ('takeoffTime' in flightUpdate || 'landingTime' in flightUpdate) {
            
            // Apply takeoffs time updates
            if (flightUpdate.takeoffTime && flightUpdate.flightNumber && flightUpdate.takeoffTime !== currentFlight.takeoffTime) {
              flightUpdate.previousTakeoffTime = currentFlight.takeoffTime;
              this.calculateDelay(flightUpdate.takeoffTime, currentFlight.takeoffTime, flightUpdate.flightNumber, true);

              // Safely access `takeoffDelay` with a fallback to 0 if not defined
              const delayInfo = this.delayTimes[flightUpdate.flightNumber];
              flightUpdate.takeoffDelay = delayInfo ? delayInfo.takeoffDelay : 0;
            }

            // Apply landings time updates
            if (flightUpdate.landingTime && flightUpdate.flightNumber && flightUpdate.landingTime !== currentFlight.landingTime) {
              flightUpdate.previousLandingTime = currentFlight.landingTime;
              this.calculateDelay(flightUpdate.landingTime, currentFlight.landingTime, flightUpdate.flightNumber, false);

              // Safely access `landingDelay` with a fallback to 0 if not defined
              const delayInfo = this.delayTimes[flightUpdate.flightNumber];
              flightUpdate.landingDelay = delayInfo ? delayInfo.landingDelay : 0;
            }
    
            // Apply other updates
            this.flights[index] = { ...currentFlight, ...flightUpdate };
          }
        } else {
          // If the flight is new, add it directly
          this.flights.push(flightUpdate as Flight);
        }
    
        // Reapply the filter
        this.filterFlights(this.currentSearchTerm);
      });
    });
}

  // Function to load all the flights using API
  async loadAllFlights() {
    try {
      const flights = await fetchAllFlights();
      runInAction(() => {
        if (!this.initialLoadComplete) {
            // Initial load
            this.flights = flights.map(flight => ({
              ...flight,
              previousTakeoffTime: flight.takeoffTime,
              previousLandingTime: flight.landingTime,
            }));
            // Set the flag to true after initial load for not to enter again enless an error accures
            this.initialLoadComplete = true;
        } else {
            // Update the flights
            this.flights = flights;
        }
      });
    } catch (error) {
      console.error("Could not load flights", error);
    }
  }

  // Function to load a flight using API
  async loadFlightByNumber(flightNumber: string) {
    try {
      const flight = await fetchFlightByNumber(flightNumber);
      runInAction(() => {
        // Update or add the specific flight in the flights array
        const index = this.flights.findIndex(f => f.flightNumber?.toLowerCase() === flight.flightNumber?.toLowerCase());
        if (index > -1) {
          this.flights[index] = flight;
        } else {
          this.flights.push(flight);
        }
      });
      return flight;
    } catch (error) {
      console.error(`Could not load flight ${flightNumber}`, error);
      return null;
    }
  }

  // Function to filter the flights according to a search term
  async filterFlights(searchTerm: string) {
    this.currentSearchTerm = searchTerm;
    if (!searchTerm.trim()) {
        // If no term was entered to the search bar then show all flights
        runInAction(() => {
            this.filteredFlights = this.flights;
          });
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

