
export interface Flight {
    /** Unique flight identifier. Example: AB1234 */
    flightNumber: string;
    status: 'hangar' | 'airborne' | 'malfunction';
    takeoffTime: string;
    landingTime: string;
    takeoffAirport: string;
    landingAirport: string;
    previousTakeoffTime?: string;
    previousLandingTime?: string;
    takeoffDelay: number;
    landingDelay: number;
}

export interface DelayTimes {
      takeoffDelay: number;
      landingDelay: number;
  }
  