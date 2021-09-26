import { Injectable } from '@angular/core';

const FLIGHT_NAME = null;
const FLIGHT_NO = null;

@Injectable({
  providedIn: 'root'
})
export class Flight {

    airline_Id!: number;
    airline_Name: string;
    airline_Status: string;
   constructor(//airline_Id: number,
         airline_Name: string, airline_Status: string){
   // this.airline_Id = airline_Id;
    this.airline_Name = airline_Name;
    this.airline_Status = airline_Status;
    }
}