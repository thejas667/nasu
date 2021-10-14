import { Injectable } from '@angular/core';

const FLIGHT_NAME = null;
const FLIGHT_NO = null;

@Injectable({
  providedIn: 'root'
})
export class Flight {
    id: number;
    flightCode: string;
    flightCompanyName: string;
    flightArriveFrom: string;
    flightDepartTo: string;
    scheduledDate: string;
    timeOfTravel: number;
    flightStatus: string;
    flightDistance: string;
   constructor(){
   
    }

  public saveFlightCode(flightCode: any):void{
    window.sessionStorage.removeItem(FLIGHT_NO);
    window.sessionStorage.setItem(FLIGHT_NO, JSON.stringify(flightCode));
  }

  public getFlightCode(): any{
    const flightCode = window.sessionStorage.getItem(FLIGHT_NO);
    if(flightCode){
      return JSON.parse(flightCode);
    }
  }
    
}