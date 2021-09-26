import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { UserService } from '../_services/user.service';
import { Flight } from '../_services/Flight';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  content?: string;
  ImagePath: string;

  form: any = {
    username: null,
    password: null,
    travelDate: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  email = '';
  
  constructor(private userService: UserService, private http: HttpClient, private flight: Flight) { 
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
  }

  onSubmit(): void {
    const { from, to, travelDate } = this.form;

    this.userService.getFlightSearch(from, to, travelDate).subscribe(
      data => {
        this.flight.airline_Id = data.airline_Id;
        this.flight.airline_Name = data.airline_Name;
        this.flight.airline_Status = data.airline_Status;
        this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }

}
