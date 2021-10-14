import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminService } from '../_services/admin.service';
import { Flight } from '../_services/Flight';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  collectDataInModalPage_afterEdit = {};  
  content?: string;
  flightFetched = false;
  addDiscountVal=false;
  addFlightVal = false;
  editFlightVal = false;
  cancelFlightVal = false;
  errorMessage = '';
  flightAdded = false;
  currentFetchedFlightList = false;
  currentFetchedFlightListForDiscount = false;
  flights = [];
  discount:number;
  form: any = {
    id:'',
    flightCode:'',
    flightCompanyName:'',
    flightArriveFrom:'',
    flightDepartTo:'',
    scheduledDate:'',
    timeOfTravel:'',
    flightStatus:'',
    discount:''

  };

  constructor(private adminService: AdminService, private router: Router, private flight: Flight, private datePipe: DatePipe) { }

  ngOnInit(): void {
  // this.userService.getAdminContent().subscribe(
  //     data => {
  //       this.content = data;
  //     },
  //     err => {
  //       this.content = JSON.parse(err.error).message;
  //     }
  //   );
  this.collectDataInModalPage_afterEdit = Object.assign({},this.flight)
  }

  addFlight(){
    this.addFlightVal = true;
    this.editFlightVal = false;
    this.cancelFlightVal = false;
    this.currentFetchedFlightList = false;
  }

  editFlight(){
    this.editFlightVal = true;
    this.addFlightVal = false;
    this.cancelFlightVal = false;
    this.currentFetchedFlightList = false;
  }

  cancelFlight(){
    this.cancelFlightVal = true;
    this.editFlightVal = false;
    this.addFlightVal = false;
    this.currentFetchedFlightList = false;
  }

  addFlightSubmit(){
    const { flightCode, flightCompanyName, flightArriveFrom, flightDepartTo, scheduledDate, timeOfTravel, flightStatus } = this.form;
    this.flight = new Flight();
    this.flight.flightCode = flightCode ;
    this.flight.flightCompanyName = flightCompanyName;
    this.flight.flightArriveFrom = flightArriveFrom;
    this.flight.flightDepartTo = flightDepartTo;
    this.flight.scheduledDate = scheduledDate;
    this.flight.timeOfTravel = timeOfTravel;
    this.flight.flightStatus = flightStatus;
    this.adminService.saveFlight(this.flight).subscribe(
      data => {
        
         this.flightAdded = true;
         this.cancelFlightVal = false;
         this.editFlightVal = false;
         this.addFlightVal = false;
      },
      err => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
      }
    );
  }

  addDiscountSubmit(){
    const { flightCode, discount } = this.form;

    this.adminService.saveDiscount(flightCode, discount).subscribe(
      data => {
        
         this.flightAdded = true;
         this.cancelFlightVal = false;
         this.editFlightVal = false;
         this.addFlightVal = false;
      },
      err => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
      }
    );
  }

  getFlightDetails(){
    const { flightCode } = this.form;
    this.adminService.searchFlightOnCode(flightCode).subscribe(
      data => {
         // console.log(entry); // 1, "string", false
          this.flight = new Flight();
          
          this.flight.flightCode = data.flightCode;
          this.flight.flightCompanyName = data.flightCompanyName;
          this.flight.flightArriveFrom = data.flightArriveFrom;
          this.flight.flightDepartTo = data.flightDepartTo;
          // var d = new Date(Date.parse(data.scheduledDate));
          // var e = new Date(d.getDate+"-"+d.getMonth+"-"+d.getFullYear);
          this.flight.scheduledDate = this.getFormatedDate(data.scheduledDate, "DD-MM-YYYY");
          this.flight.timeOfTravel = data.timeOfTravel;
          this.flight.flightStatus = data.flightStatus;

          this.form.flightCode = data.flightCode;
          this.form.flightCompanyName = data.flightCompanyName;
          this.form.flightArriveFrom = data.flightArriveFrom;
          this.form.flightDepartTo = data.flightDepartTo;
          this.form.scheduledDate = data.scheduledDate;
          this.form.timeOfTravel = data.timeOfTravel;
          this.form.flightStatus = data.flightStatus;
          this.flights.push(this.flight);
        
         this.flightAdded = false;
         this.cancelFlightVal = true;
         this.editFlightVal = false;
         this.addFlightVal = false;
         this.currentFetchedFlightList = true;

      },
      err => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
      }
    );
  }

  cancelFlightSubmit(){
    const { flightCode, flightCompanyName, flightArriveFrom, flightDepartTo, scheduledDate, timeOfTravel, flightStatus } = this.form;
    this.flight = new Flight();
    this.flight.flightCode = flightCode ;
    this.flight.flightCompanyName = flightCompanyName;
    this.flight.flightArriveFrom = flightArriveFrom;
    this.flight.flightDepartTo = flightDepartTo;
    this.flight.scheduledDate = scheduledDate;
    this.flight.timeOfTravel = timeOfTravel;
    this.flight.flightStatus = flightStatus;
    this.adminService.cancelFlight(this.flight).subscribe(
      data => {
        
         this.flightAdded = false;
         this.cancelFlightVal = false;
         this.editFlightVal = false;
         this.addFlightVal = false;
         this.addDiscountVal = false;
      },
      err => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
      }
    );
  }

  getFlightDetailsForEdit(){
    const { flightCode } = this.form;
    this.adminService.searchFlightOnCode(flightCode).subscribe(
      data => {
         // console.log(entry); // 1, "string", false
          this.flight = new Flight();
          
          this.flight.flightCode = data.flightCode;
          this.flight.flightCompanyName = data.flightCompanyName;
          this.flight.flightArriveFrom = data.flightArriveFrom;
          this.flight.flightDepartTo = data.flightDepartTo;
          // var d = new Date(Date.parse(data.scheduledDate));
          // var e = new Date(d.getDate+"-"+d.getMonth+"-"+d.getFullYear);
          this.flight.scheduledDate = this.getFormatedDate(data.scheduledDate, "DD-MM-YYYY");
          this.flight.timeOfTravel = data.timeOfTravel;
          this.flight.flightStatus = data.flightStatus;

          this.form.flightCode = data.flightCode;
          this.form.flightCompanyName = data.flightCompanyName;
          this.form.flightArriveFrom = data.flightArriveFrom;
          this.form.flightDepartTo = data.flightDepartTo;
          this.form.scheduledDate = data.scheduledDate;
          this.form.timeOfTravel = data.timeOfTravel;
          this.form.flightStatus = data.flightStatus;
          this.flights.push(this.flight);
        
         this.flightAdded = false;
         this.cancelFlightVal = false;
         this.editFlightVal = true;
         this.addFlightVal = false;
         this.addDiscountVal = false;
         this.currentFetchedFlightList = true;

      },
      err => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
      }
    );
  }

  editFlightSubmit(){
    const { flightCode, flightCompanyName, flightArriveFrom, flightDepartTo, scheduledDate, timeOfTravel, flightStatus } = this.flight;
    this.flight = new Flight();
    this.flight.flightCode = flightCode ;
    this.flight.flightCompanyName = flightCompanyName;
    this.flight.flightArriveFrom = flightArriveFrom;
    this.flight.flightDepartTo = flightDepartTo;
    this.flight.scheduledDate = scheduledDate;
    this.flight.timeOfTravel = timeOfTravel;
    this.flight.flightStatus = flightStatus;
    this.adminService.editFlight(this.flight).subscribe(
      data => {
        
         this.flightAdded = false;
         this.cancelFlightVal = false;
         this.editFlightVal = false;
         this.addFlightVal = false;
         this.addDiscountVal = false;
      },
      err => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
      }
    );
  }

  addDiscount(){
    this.addDiscountVal = true;
    this.flightAdded = false;
    this.cancelFlightVal = false;
    this.editFlightVal = false;
    this.addFlightVal = false;
  }
  
  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
    
  }

  getFlightDetailsForDiscount(){
    const { flightCode } = this.form;
    this.adminService.searchFlightOnCode(flightCode).subscribe(
      data => {
         // console.log(entry); // 1, "string", false
          this.flight = new Flight();
          
          this.flight.flightCode = data.flightCode;
          this.flight.flightCompanyName = data.flightCompanyName;
          this.flight.flightArriveFrom = data.flightArriveFrom;
          this.flight.flightDepartTo = data.flightDepartTo;
          // var d = new Date(Date.parse(data.scheduledDate));
          // var e = new Date(d.getDate+"-"+d.getMonth+"-"+d.getFullYear);
          this.flight.scheduledDate = this.getFormatedDate(data.scheduledDate, "DD-MM-YYYY");
          this.flight.timeOfTravel = data.timeOfTravel;
          this.flight.flightStatus = data.flightStatus;

          this.form.flightCode = data.flightCode;
          this.form.flightCompanyName = data.flightCompanyName;
          this.form.flightArriveFrom = data.flightArriveFrom;
          this.form.flightDepartTo = data.flightDepartTo;
          this.form.scheduledDate = data.scheduledDate;
          this.form.timeOfTravel = data.timeOfTravel;
          this.form.flightStatus = data.flightStatus;
          this.flights.push(this.flight);
        
         this.flightAdded = false;
         this.cancelFlightVal = false;
         this.editFlightVal = false;
         this.addFlightVal = false;
         this.addDiscountVal = true;
         this.currentFetchedFlightList = false;
         this.currentFetchedFlightListForDiscount = true;

      },
      err => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
      }
    );
  }

}
