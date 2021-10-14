import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TokenStorageService } from './token-storage.service';
import { ticket } from './Ticket';

const API_URL = 'http://localhost:8765/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private http: HttpClient, private tokenStorage : TokenStorageService) { }
  token:string = '';
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.token = this.tokenStorage.getToken();
      //this.roles = this.tokenStorage.getUser().roles;
    }
  }

  getPublicContent(): Observable<any> {
      // let httpParams = new HttpParams()
      //     .set('uesrname', this.tokenStorage.getUser().username);/api/test
    return this.http.get(API_URL + 'flight-booking-service/api/v1.0/flight/ticket/213232', httpOptions);
  }

  getFlightSearch(from: string, to: string, travelDate: string): Observable<any> {
    return this.http.post(API_URL + 'flight-booking-service/api/v1.0/flight/search/from/'+from+'/to/'+to+'/dot/'+travelDate, {
      from,
      to,
      travelDate
    }, httpOptions);
  }

  saveTicket(flightCode: string, ticket:ticket): Observable<any> {
    return this.http.post(API_URL + 'flight-booking-service/api/v1.0/flight/booking/'+flightCode, 
      ticket
    , httpOptions);
  }

  searchFlightHistory(emailId: string): Observable<any>{
    return this.http.get(API_URL + 'flight-booking-service/api/v1.0/flight/booking/history/'+emailId, httpOptions);
  }

  searchTicketOnPNR(pnr: string): Observable<any>{
    return this.http.get(API_URL + 'flight-booking-service/api/v1.0/flight/ticket/'+pnr, httpOptions);
  }

  cancelTicket(pnr: string): Observable<any>{
    return this.http.post(API_URL + 'flight-booking-service/api/v1.0/flight/booking/cancel/'+pnr, httpOptions);
  }

  getUserDetails(username: string): Observable<any> {
    return this.http.get(API_URL + 'flight-booking-service/api/v1.0/flight/user/details/'+username, httpOptions);
  }

  getAdminContent(): Observable<any> {
      return this.http.get(API_URL + 'admin', {responseType: 'text'});
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }
}