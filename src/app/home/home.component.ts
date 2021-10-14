import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { UserService } from '../_services/user.service';
import { Flight } from '../_services/Flight';
import { Router } from '@angular/router';
import { UserDetails } from '../_services/UserDetails';
import { TokenStorageService } from '../_services/token-storage.service';
import { ticket } from '../_services/Ticket';
import Html2Canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  
  tickets = [];
  ticket : ticket;
  searchFlightFlag=false;
  bookedTicketHitoryFlag=false;
  bookedTicketDetailsFlag = false;
  cancelTicketFlag = false;
  content?: string;
  flightFrom: string;
  flightTo: string;
  pnr: string;
  noOfSeats: number;
  meal: string;
  flightDate: string;
  ImagePath: string;
  flightDistance: string;
  flightCode: string;
  noOfTicket: string;
  fare: number;
  currentFetchedFlightList = false;
  form: any = {
    username: null,
    password: null,
    travelDate: null,
    flightCode: '',
    flightDistance: '',
    noOfTicket: ''
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  flightFetched = false;
  roles: string[] = [];
  email = '';
  flights = [];
  
  constructor(private datePipe: DatePipe, private userService: UserService, private http: HttpClient, private flight: Flight, private router:Router, private userDetails : UserDetails, private tokenService: TokenStorageService
    ) { 
    this.ImagePath = '/assets/images/bkgrnd.jpg';
  }

  ngOnInit(): void {
  this.userService.getPublicContent().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );

    this.userService.getUserDetails(this.tokenService.getUser().username).subscribe(
      data => {
        this.userDetails = new UserDetails();
        this.userDetails.email = data['email'];
        this.userDetails.username = data['username'];
        this.email = data['email'];
        
      },
      err => {
        this.content = JSON.parse(err.error).message;
        console.log(this.content);
      }
    );
  }

  onSubmit(): void {
    const { from, to, travelDate } = this.form;

    this.userService.getFlightSearch(from, to, travelDate).subscribe(
      data => {
        this.flights = [];
        for (let entry of data) {
          console.log(entry); // 1, "string", false
          this.flight = new Flight();
          this.flight.id = entry.id;
          this.flight.flightCode = entry.flightCode;
          this.flightCode = entry.flightCode;
          this.flight.flightCompanyName = entry.flightCompanyName;
          this.flight.flightArriveFrom = entry.flightArriveFrom;
          this.flight.flightDepartTo = entry.flightDepartTo;
          this.flight.scheduledDate = this.getFormatedDate(entry.scheduledDate, "dd-MM-YYYY");
          this.flight.flightDistance = entry.flightDistance;
          this.flightDistance = entry.flightDistance;
          this.flights.push(this.flight);
        }
       
        this.flightFetched = true;
        
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }
  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
    
  }
  gotToPage(pageName:string):void{
    const { from, to, travelDate, flightCode, noOfTicket, flightDistance } = this.form;
    //this.flightCode = document.getElementById('flightCode').;
    let fare = +this.flight.flightDistance * 10;
    this.fare = fare;
    this.router.navigate(['/bookTicket'], {
      state: {
        frontEnd: JSON.stringify({ from: from, to: to, travelDate: travelDate, noOfTicket: noOfTicket, flightId: this.flight.id, flightCode: this.flight.flightCode, flightDistance: this.flight.flightDistance, email: this.email, fare: this.fare }),
      }
    });
  }


  reloadPage(): void {
    window.location.reload();
  }

  bookedTicketHistory(){
    this.cancelTicketFlag = false;
    this.bookedTicketDetailsFlag = false;
    this.searchFlightFlag = false;
    this.bookedTicketHitoryFlag = true;
    this.flightFetched = false;
    this.userService.searchFlightHistory(this.userDetails.email).subscribe(
      data => {
        this.tickets = [];
        for (let entry of data) {
          console.log(entry); // 1, "string", false
          this.ticket = new ticket();
          this.ticket.id = entry.id;
          this.ticket.meal = entry.meal;
          this.ticket.flightFrom = entry.flightFrom;
          this.ticket.flightTo = entry.flightTo;
          this.ticket.pnr = entry.pnr;
          this.ticket.noOfSeats = entry.noOfSeats;
          this.ticket.fare = entry.fare;
          this.ticket.flightDate = this.getFormatedDate(entry.scheduledDate, "dd-MM-YYYY");
          
          this.tickets.push(this.ticket);
          console.log(this.tickets);
        }
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  searchFlight(){
    this.searchFlightFlag = true;
    this.bookedTicketHitoryFlag = false;
    this.cancelTicketFlag = false;
    this.bookedTicketDetailsFlag = false;
    this.flightFetched = false;
  }

  bookedTicketDetails(items:ticket){
    this.cancelTicketFlag = false;
    this.bookedTicketDetailsFlag = true;
    this.searchFlightFlag = false;
    this.bookedTicketHitoryFlag = true;
    this.ticket = new ticket();
    this.flightFetched = false;
    this.ticket.flightFrom = items.flightFrom;
    this.ticket.flightTo = items.flightTo;
    this.ticket.pnr = items.pnr;
    this.ticket.noOfSeats = items.noOfSeats;
    this.ticket.meal = items.meal;
    this.ticket.fare = items.fare;
    this.ticket.flightDate = items.flightDate;
  }

    exportAsPDF(divId)
    {
        let data = document.getElementById('exportPDF');  
        Html2Canvas(data).then(canvas => {
        const contentDataURL = canvas.toDataURL('image/png')  
        let pdf = new jsPDF('l', 'cm', 'a4'); //Generates PDF in landscape mode
        // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
        pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);  
        pdf.save('Filename.pdf');   
      }); 
    }
  

  cancelTicket(){
    this.cancelTicketFlag = true;
    this.bookedTicketDetailsFlag = false;
    this.searchFlightFlag = false;
    this.bookedTicketHitoryFlag = false;
    this.flightFetched = false;
  }

  getTiketDetails(){
    //this.searchFlightFlag = false;
    //this.bookedTicketHitoryFlag = true;
    const { pnr } = this.form;
    this.userService.searchTicketOnPNR(pnr).subscribe(
      data => {
          this.ticket = new ticket();
          this.ticket.id = data['id'];
          this.ticket.meal = data['meal'];
          this.ticket.flightFrom = data['flightFrom'];
          this.ticket.flightTo = data['flightTo'];
          this.ticket.pnr = data['pnr'];
          this.ticket.noOfSeats = data['noOfSeats'];
          this.ticket.fare = data['fare'];
          this.ticket.flightDate = this.getFormatedDate(data['scheduledDate'], "dd-MM-YYYY");
          this.currentFetchedFlightList = true;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  cancelTicketSubmit(){
    const { pnr } = this.form;
    this.userService.cancelTicket(pnr).subscribe(
      data => {
        this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );

  }

}
