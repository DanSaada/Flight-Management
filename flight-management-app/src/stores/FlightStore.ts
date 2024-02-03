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
    
    this.loadAllFlights(); // Fetch all flights upon store initialization
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
          // Use MobX's `set` to ensure the addition is observable
          set(this.delayTimes, flightNumber, { takeoffDelay: 0, landingDelay: 0 });
        }
    
        // Now it's safe to update since the object definitely exists
        // And use `set` again if modifying the properties to ensure changes are tracked
        if (flag) {
          set(this.delayTimes[flightNumber], 'takeoffDelay', delay);
        } else {
          set(this.delayTimes[flightNumber], 'landingDelay', delay);
        }
      }
    };
    
    

  // async setupSocket() {
  //   const socket = io('http://localhost:4963');
  //   socket.on('flight-update', (flightUpdate: Partial<Flight>) => {
  //     runInAction(() => {
  //       const index = this.flights.findIndex(f => f.flightNumber === flightUpdate.flightNumber);
  //       if (index > -1) {
  //         const currentFlight = this.flights[index];
          
    
  //         // Directly check and apply status updates without time updates
  //         if ('status' in flightUpdate && !(('takeoffTime' in flightUpdate) || ('landingTime' in flightUpdate))) {
  //           // Apply only the status update
  //           if (flightUpdate.status !== undefined) {
  //             this.flights[index] = { ...currentFlight, status: flightUpdate.status };
  //           }
            
  //         }
    
  //         // Handle time updates (takeoff or landing)
  //         if ('takeoffTime' in flightUpdate || 'landingTime' in flightUpdate) {
  //           // Now we're sure this update is about time, not status
  //           const isTakeoffTimeUpdated = 'takeoffTime' in flightUpdate && flightUpdate.takeoffTime !== currentFlight.takeoffTime;
  //           const isLandingTimeUpdated = 'landingTime' in flightUpdate && flightUpdate.landingTime !== currentFlight.landingTime;
    
  //           if (isTakeoffTimeUpdated) {
  //             flightUpdate.previousTakeoffTime = currentFlight.takeoffTime;
  //             flightUpdate.takeoffDelay = this.calculateDelay(flightUpdate.takeoffTime!, currentFlight.takeoffTime);
  //           }
  //           if (isLandingTimeUpdated) {
  //             flightUpdate.previousLandingTime = currentFlight.landingTime;
  //             flightUpdate.landingDelay = this.calculateDelay(flightUpdate.landingTime!, currentFlight.landingTime);
  //           }
    
  //           // Apply the time update
  //           this.flights[index] = { ...currentFlight, ...flightUpdate };
  //         }
  //       } else {
  //         // New flight logic remains unchanged
  //         this.flights.push(flightUpdate as Flight);
  //       }
    
  //       // Reapply the filter
  //       this.filterFlights(this.currentSearchTerm);
  //     });
  //   });
  // }

  // async loadAllFlights() {
  //   try {
  //     const flights = await fetchAllFlights();
  //     runInAction(() => {
  //       this.flights = flights;
  //       // Reapply the filter to the newly fetched flights
  //       this.filterFlights(this.currentSearchTerm);
  //     });
  //   } catch (error) {
  //     console.error("Could not load flights", error);
  //   }
  // }

  async setupSocket() {
    const socket = io('http://localhost:4963');
    socket.on('flight-update', (flightUpdate: Partial<Flight>) => {
      runInAction(() => {
        const index = this.flights.findIndex(f => f.flightNumber === flightUpdate.flightNumber);
        if (index > -1) {
          const currentFlight = this.flights[index];
          
          // Directly check and apply status updates without time updates
          if (flightUpdate.status !== undefined && flightUpdate.status !== currentFlight.status) {
              this.flights[index] = { ...currentFlight, status: flightUpdate.status };
          }
          else if ('takeoffTime' in flightUpdate || 'landingTime' in flightUpdate) { // Handle time updates (takeoff or landing)
            
            // Calculate delay for takeoff time, if updated
            // Assuming this code snippet is from the part where you're experiencing the error
            if (flightUpdate.takeoffTime && flightUpdate.flightNumber && flightUpdate.takeoffTime !== currentFlight.takeoffTime) {
              flightUpdate.previousTakeoffTime = currentFlight.takeoffTime;
              this.calculateDelay(flightUpdate.takeoffTime, currentFlight.takeoffTime, flightUpdate.flightNumber, true);

              // Safely access `takeoffDelay` with a fallback to 0 if not defined
              const delayInfo = this.delayTimes[flightUpdate.flightNumber];
              flightUpdate.takeoffDelay = delayInfo ? delayInfo.takeoffDelay : 0;
              
            }


            // Calculate delay for landing time, if updated
            if (flightUpdate.landingTime && flightUpdate.flightNumber && flightUpdate.landingTime !== currentFlight.landingTime) {
              flightUpdate.previousLandingTime = currentFlight.landingTime;
              this.calculateDelay(flightUpdate.landingTime, currentFlight.landingTime, flightUpdate.flightNumber, false);
              // Safely access `takeoffDelay` with a fallback to 0 if not defined
              const delayInfo = this.delayTimes[flightUpdate.flightNumber];
              flightUpdate.landingDelay = delayInfo ? delayInfo.landingDelay : 0;
            }
    
            // Apply the time update
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


  async loadAllFlights() {
    try {
      const flights = await fetchAllFlights();
      runInAction(() => {
        if (!this.initialLoadComplete) {
            // If it's the initial load, set initial times and delays
            this.flights = flights.map(flight => ({
              ...flight,
              previousTakeoffTime: flight.takeoffTime,
              previousLandingTime: flight.landingTime,

            }));
            this.initialLoadComplete = true; // Set the flag to true after initial load
        } else {
            // For subsequent calls, just update the flights array without resetting delays
            this.flights = flights;
        }
        // Reapply the filter to the newly fetched flights
        
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
        const index = this.flights.findIndex(f => f.flightNumber?.toLowerCase() === flight.flightNumber?.toLowerCase());
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
        // If no term was entered to the search bar
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



