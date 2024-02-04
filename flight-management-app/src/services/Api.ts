import axios from 'axios';
import { Flight } from '../types/Interfaces';

const BASE_URL = 'http://localhost:4963';

// Function to fetch all the flights data from the server
export const fetchAllFlights = async (): Promise<Flight[]> => {
  try {
    const response = await axios.get<{ flights: Flight[] }>(`${BASE_URL}/flights`);
    return response.data.flights;
  } catch (error) {
    console.error('Error fetching all flights:', error);
    throw error;
  }
};

// Function to fetch a flight data from the server
export const fetchFlightByNumber = async (flightNumber: string): Promise<Flight> => {
  try {
    const response = await axios.get<Flight>(`${BASE_URL}/flights/${flightNumber}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching flight ${flightNumber}:`, error);
    throw error;
  }
};
