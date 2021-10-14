import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TokenStorageService } from './token-storage.service';
import { ticket } from './Ticket';
import { Flight } from './Flight';

const API_URL = 'http://localhost:8765/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  constructor(private http: HttpClient, private tokenStorage : TokenStorageService) { }
  token:string = '';
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.token = this.tokenStorage.getToken();
    }
  }

  saveFlight(flight: Flight): Observable<any>{
    return this.http.post(API_URL + 'flight-admin-service/api/v1.0/flight/airline/inventory/add', flight, httpOptions);
  }

  searchFlightOnCode(flightCode: string): Observable<any>{
      return this.http.get(API_URL + 'flight-admin-service/api/v1.0/flight/airline/searchFlight/'+flightCode, httpOptions);
  }

  cancelFlight(flight: Flight): Observable<any>{
      return this.http.post(API_URL + 'flight-admin-service/api/v1.0/flight/airline/inventory/cancel', flight, httpOptions);
  }
    
  editFlight(flight: Flight): Observable<any>{
    return this.http.post(API_URL + 'flight-admin-service/api/v1.0/flight/airline/inventory/edit/'+flight.flightCode, flight, httpOptions);
  }

  saveDiscount(flightCode:string, discount:string): Observable<any>{
    return this.http.post(API_URL+'/api/v1.0/flight/airline/addDiscount/discount/'+flightCode+'/flightId/'+discount, httpOptions);
  }
  
}