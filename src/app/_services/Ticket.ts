import { Injectable } from '@angular/core';
import { passengers } from './Passengers';

@Injectable({
  providedIn: 'root'
})

export class ticket {

    id:number;
    tEmail: string;
    noOfSeats: number;
    meal: string;
    fare: number;
    pnr: string;
    flightId: string;
    flightFrom: string;
    flightTo: string;
    flightDate: string;
    passengerDetails: passengers[];

   constructor(){
   
    }

    
}