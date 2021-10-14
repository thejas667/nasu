import { Injectable } from '@angular/core';
import { passengers } from './Passengers';

const USER_DETAILS = '';

@Injectable({
  providedIn: 'root'
})

export class UserDetails {

    id:number;
    email: string;
    username: string;
    usettype: string;
   constructor(){}

    public saveUserDetails(user: any):void{
        window.sessionStorage.removeItem(USER_DETAILS);
        window.sessionStorage.setItem(USER_DETAILS, JSON.stringify(user));
    }

    public getUserDetails(): any{
        const userdetails = window.sessionStorage.getItem(USER_DETAILS);
        if(userdetails){
            return JSON.parse(userdetails);
        }
    }

    
}