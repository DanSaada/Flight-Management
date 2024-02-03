import { makeAutoObservable, runInAction } from 'mobx';
import io from 'socket.io-client';
import { Flight } from '../types/flight';
import { fetchAllFlights, fetchFlightByNumber } from '../services/Api';
import moment from 'moment';

/**
 * The FlightStore class is a MobX store used to manage and store flight-related data in a 
 * React application. It maintains a list of flights, filters flights based on a search term, 
 * and updates flight data in response to real-time events via a WebSocket connection.
 */

// class FlightStore {
//   flights: Flight[] = [];
//   filteredFlights: Flight[] = [];
//   currentSearchTerm: string = '';
//   initialLoadComplete: boolean = false;

//   constructor() {
//     makeAutoObservable(this);
//     this.setupSocket();
//     this.loadAllFlights(); // Fetch all flights upon store initialization
//   }

//     // Function to calculate delay in minutes
//     calculateDelay = (current: string, previous?: string) => {
//         const currentTime = moment(current, "DD/MM/YYYY - HH:mm");
//         const previousTime = moment(previous || current, "DD/MM/YYYY - HH:mm");
//         return currentTime.diff(previousTime, 'minutes');
//     };

//   setupSocket() {
//     const socket = io('http://localhost:4963');
//     socket.on('flight-update', (flightUpdate: Partial<Flight>) => {
//       runInAction(() => {
//         const index = this.flights.findIndex(f => f.flightNumber === flightUpdate.flightNumber);
//         if (index > -1) {
//             const currentFlight = this.flights[index];
//             // Update previous times only if they are different
//             if (flightUpdate.takeoffTime && (flightUpdate.takeoffTime !== currentFlight.takeoffTime) && (flightUpdate.flightNumber === currentFlight.flightNumber)) {
//                 console.log(flightUpdate.flightNumber)
//                 flightUpdate.previousTakeoffTime = currentFlight.takeoffTime;
//                 console.log("current: " + flightUpdate.takeoffTime)
//                 console.log("prev: " + flightUpdate.previousTakeoffTime)
//                 flightUpdate.takeoffDelay = this.calculateDelay(flightUpdate.takeoffTime, flightUpdate.previousTakeoffTime);
//                 console.log(flightUpdate.takeoffDelay)
//             }
//             if (flightUpdate.landingTime && (flightUpdate.landingTime !== currentFlight.landingTime) && (flightUpdate.flightNumber === currentFlight.flightNumber)) {
//               flightUpdate.previousLandingTime = currentFlight.landingTime;
//               flightUpdate.landingDelay = this.calculateDelay(flightUpdate.landingTime, flightUpdate.previousLandingTime)
//             }
//             // Now apply any other updates that might be there
//             this.flights[index] = { ...currentFlight, ...flightUpdate };
//             console.log("--------------------------------")
//             console.log(this.flights[index].flightNumber)
//             console.log(this.flights[index].previousTakeoffTime)
//             console.log(this.flights[index].takeoffTime)
//             console.log("--------------------------------")
//         } else {
//             const newFlight: Flight = {
//                 ...flightUpdate as Flight,
//                 previousTakeoffTime: flightUpdate.takeoffTime || '',
//                 previousLandingTime: flightUpdate.landingTime || '',
//                 takeoffDelay: 0,
//                 landingDelay: 0,
//               };
//           this.flights.push(flightUpdate as Flight);
//         }
//         // Reapply the filter whenever the flights data is updated
//         this.filterFlights(this.currentSearchTerm);
//       });
//     });
//   }


class FlightStore {
  flights: Flight[] = [];
  filteredFlights: Flight[] = [];
  currentSearchTerm: string = '';
  initialLoadComplete: boolean = false;
  updateBuffer: Partial<Flight>[] = []; // Buffer for incoming updates
  debounceTimer: any = null; // Timer for debouncing
  debounceDelay: number = 300; // Delay in milliseconds

  constructor() {
    makeAutoObservable(this);
    this.setupSocket();
    this.loadAllFlights(); // Fetch all flights upon store initialization
  }

  setupSocket() {
    const socket = io('http://localhost:4963');
    socket.on('flight-update', (flightUpdate: Partial<Flight>) => {
      // Accumulate updates in the buffer
      this.updateBuffer.push(flightUpdate);
      
      // Clear the existing timer and restart the debounce timer
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        runInAction(() => {
          this.processUpdates(); // Process all updates in the buffer
        });
      }, this.debounceDelay);
    });
  }

      // Function to calculate delay in minutes
  calculateDelay = (current: string, previous?: string) => {
      const currentTime = moment(current, "DD/MM/YYYY - HH:mm");
      const previousTime = moment(previous || current, "DD/MM/YYYY - HH:mm");
      return currentTime.diff(previousTime, 'minutes');
  };

  processUpdates() {
    // Process all accumulated updates in the buffer
    this.updateBuffer.forEach((flightUpdate) => {
      const index = this.flights.findIndex(f => f.flightNumber === flightUpdate.flightNumber);
      if (index > -1) {
        const currentFlight = this.flights[index];
        // Update previous times only if they are different
        if (flightUpdate.takeoffTime && (flightUpdate.takeoffTime !== currentFlight.takeoffTime) && (flightUpdate.flightNumber === currentFlight.flightNumber)) {
            console.log(flightUpdate.flightNumber)
            flightUpdate.previousTakeoffTime = currentFlight.takeoffTime;
            console.log("current: " + flightUpdate.takeoffTime)
            console.log("prev: " + flightUpdate.previousTakeoffTime)
            flightUpdate.takeoffDelay = this.calculateDelay(flightUpdate.takeoffTime, flightUpdate.previousTakeoffTime);
            console.log(flightUpdate.takeoffDelay)
        }
        if (flightUpdate.landingTime && (flightUpdate.landingTime !== currentFlight.landingTime) && (flightUpdate.flightNumber === currentFlight.flightNumber)) {
          flightUpdate.previousLandingTime = currentFlight.landingTime;
          flightUpdate.landingDelay = this.calculateDelay(flightUpdate.landingTime, flightUpdate.previousLandingTime)
        }
        // Now apply any other updates that might be there
        this.flights[index] = { ...currentFlight, ...flightUpdate };
        console.log("--------------------------------")
        console.log(this.flights[index].flightNumber)
        console.log(this.flights[index].previousTakeoffTime)
        console.log(this.flights[index].takeoffTime)
        console.log("--------------------------------")
      } else {
        // Handle new flights, if applicable
        this.flights.push(flightUpdate as Flight);
      }
    });
    
    // Reapply the filter to the updated flights
    this.filterFlights(this.currentSearchTerm);
    
    // Clear the buffer after processing
    this.updateBuffer = [];
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
              takeoffDelay: 0,
              landingDelay: 0,
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



// import { makeAutoObservable, runInAction } from 'mobx';
// import io from 'socket.io-client';
// import { Flight } from '../types/flight';
// import { fetchAllFlights, fetchFlightByNumber } from '../services/Api';
// import moment from 'moment';

// class FlightStore {
//   flights: Flight[] = [];
//   filteredFlights: Flight[] = [];
//   currentSearchTerm: string = '';
//   initialLoadComplete: boolean = false;
//   updateQueue: Partial<Flight>[] = [];
//   isProcessingQueue: boolean = false;

//   constructor() {
//     makeAutoObservable(this);
//     this.setupSocket();
//     this.loadAllFlights();
//   }

//   calculateDelay = (current: string, previous?: string) => {
//     const currentTime = moment(current, "DD/MM/YYYY - HH:mm");
//     const previousTime = moment(previous || current, "DD/MM/YYYY - HH:mm");
//     return currentTime.diff(previousTime, 'minutes');
//   };

//   processUpdateQueue = () => {
//     if (this.updateQueue.length === 0 || this.isProcessingQueue) {
//       return;
//     }

//     this.isProcessingQueue = true;
//     const flightUpdate = this.updateQueue.shift();

//     if (flightUpdate) {
//       const index = this.flights.findIndex(f => f.flightNumber === flightUpdate.flightNumber);
//       if (index > -1) {
//         const currentFlight = this.flights[index];
//         if (flightUpdate.takeoffTime && flightUpdate.takeoffTime !== currentFlight.takeoffTime) {
//           flightUpdate.previousTakeoffTime = currentFlight.takeoffTime;
//           flightUpdate.takeoffDelay = this.calculateDelay(flightUpdate.takeoffTime, flightUpdate.previousTakeoffTime);
//         }
//         if (flightUpdate.landingTime && flightUpdate.landingTime !== currentFlight.landingTime) {
//           flightUpdate.previousLandingTime = currentFlight.landingTime;
//           flightUpdate.landingDelay = this.calculateDelay(flightUpdate.landingTime, flightUpdate.previousLandingTime);
//         }
//         this.flights[index] = { ...currentFlight, ...flightUpdate };
//       } else {
//         const newFlight: Flight = {
//           ...flightUpdate as Flight,
//           previousTakeoffTime: flightUpdate.takeoffTime || '',
//           previousLandingTime: flightUpdate.landingTime || '',
//           takeoffDelay: 0,
//           landingDelay: 0,
//         };
//         this.flights.push(newFlight);
//       }
//       this.filterFlights(this.currentSearchTerm);
//     }

//     this.isProcessingQueue = false;

//     if (this.updateQueue.length > 0) {
//       setTimeout(this.processUpdateQueue, 0);
//     }
//   };

//   setupSocket() {
//     const socket = io('http://localhost:4963');
//     socket.on('flight-update', (flightUpdate: Partial<Flight>) => {
//       runInAction(() => {
//         this.updateQueue.push(flightUpdate);
//         this.processUpdateQueue();
//       });
//     });
//   }

//   async loadAllFlights() {
//     try {
//       const flights = await fetchAllFlights();
//       runInAction(() => {
//         if (!this.initialLoadComplete) {
//           this.flights = flights.map(flight => ({
//             ...flight,
//             previousTakeoffTime: flight.takeoffTime,
//             previousLandingTime: flight.landingTime,
//             takeoffDelay: 0,
//             landingDelay: 0,
//           }));
//           this.initialLoadComplete = true;
//         } else {
//           this.flights = flights;
//         }
//       });
//     } catch (error) {
//       console.error("Could not load flights", error);
//     }
//   }

//   async loadFlightByNumber(flightNumber: string) {
//     try {
//       const flight = await fetchFlightByNumber(flightNumber);
//       runInAction(() => {
//         const index = this.flights.findIndex(f => f.flightNumber?.toLowerCase() === flight.flightNumber?.toLowerCase());
//         if (index > -1) {
//           this.flights[index] = flight;
//         } else {
//           this.flights.push(flight);
//         }
//       });
//     } catch (error) {
//       console.error(`Could not load flight ${flightNumber}`, error);
//     }
//   }

//   async filterFlights(searchTerm: string) {
//     this.currentSearchTerm = searchTerm;
//     if (!searchTerm.trim()) {
//       this.filteredFlights = this.flights;
//     } else {
//       const lowerCaseSearchTerm = searchTerm.toLowerCase();
//       this.filteredFlights = this.flights.filter(flight =>
//         flight.flightNumber?.toLowerCase().includes(lowerCaseSearchTerm) ||
//         flight.takeoffAirport?.toLowerCase().includes(lowerCaseSearchTerm) ||
//         flight.landingAirport?.toLowerCase().includes(lowerCaseSearchTerm)
//       );
//     }
//   }

//   get visibleFlights() {
//     return this.currentSearchTerm ? this.filteredFlights : this.flights;
//   }
// }

// export const flightStore = new FlightStore();
