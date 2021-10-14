import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { UserService } from '../_services/user.service';
import { Flight } from '../_services/Flight';
import { Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import { ticket } from '../_services/Ticket';
import { passengers } from '../_services/Passengers';

@Component({
  selector: 'app-ticket-booking',
  templateUrl: './ticket-booking.component.html',
  styleUrls: ['./ticket-booking.component.scss']
})
export class TicketBookingComponent implements OnInit {
  showAddedPassengerTable=false;
  data: any = {};
  routeState: any;
  tempFare: number;
  tempDist: number;
  fare: string;
  flightDistance: string;
  flightId: number;
  flightCode: string;
  tEmail: string;
  passengersarr: any=[];
  passengername: string; 
  passengerage: string; 
  gender: string;
  form: any = {
    tEmail:'', noOfSeats:'', meal:'', fare:'', flightId:'', flightDistance:'',
     from:'', to:'', travelDate:'', passengername:'', passengerage:'', gender:''
  };
  errorMessage = '';

  constructor( private passenger: passengers, private ticket: ticket, private tokenStorage: TokenStorageService, private router: Router, private flight: Flight, private userService: UserService, private http: HttpClient) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.routeState = this.router.getCurrentNavigation().extras.state;
      if (this.routeState) {
        this.data.frontEnd = this.routeState.frontEnd ? JSON.parse(this.routeState.frontEnd) : '';
        this.data.site = this.routeState.site ? this.routeState.site : '';
        this.tEmail = this.data.frontEnd.email;
        this.tempDist = +this.data.frontEnd.flightDistance;
        this.tempFare = this.tempDist * 10;
        this.fare = this.tempFare.toFixed.toString();
        this.flightId = this.data.frontEnd.flightId;
        this.flightCode = this.data.frontEnd.flightCode;
        this.ticket.fare = +this.data.frontEnd.fare;
        
      }
    }
  }
  ngOnInit(): void {

  }

  onSubmit(): void {
    const { tEmail, noOfSeats, meal, fare, flightId, from, to, travelDate, passengers, pasengername, passengerage, gender } = this.form;
    
    this.ticket = new ticket();
    this.ticket.flightId = this.flightId.toString();
    this.ticket.tEmail = this.tEmail;
    this.ticket.fare = +this.fare;
    this.ticket.meal = meal;
    this.ticket.noOfSeats = noOfSeats;
    this.ticket.passengerDetails = this.passengersarr;
    this.userService.saveTicket(this.flightId.toString(), this.ticket).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
        
      }
    );
  }

  addPassengersToArray(): void {
    this.showAddedPassengerTable = true;
    this.passenger = new passengers();
    let name = this.form.passengername;
  //  let gender = (<HTMLInputElement>document.getElementById('gender')).value;
    let gender=this.form.gender;
    let age = this.form.passengerage;
    //let seatNo = (<HTMLInputElement>document.getElementById('seatNo')).value;
    const arr: Array<{name: string, gender: string, age: string}> = [name,gender,age];
    this.passenger.pName = name;
    this.passenger.pAge = age;
    this.passenger.pGender = gender;
    this.passengersarr.push(this.passenger);
    console.log("passenger array "+this.passengersarr);
    this.clear();
  }

  clear(){
    this.form.passengername='';
    this.form.passengerage='';
    this.form.gender='';
  }
}
