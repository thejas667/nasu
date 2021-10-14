import { Component, OnInit } from '@angular/core';
import { NgModule }  from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { jsPDF } from 'jspdf';
import Html2Canvas from 'html2canvas';

import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  showUserBoard = false;
  username?: string;

  title = 'angular2';
  constructor(private tokenStorageService: TokenStorageService, private router: Router){}

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.usertype;

      this.showAdminBoard = this.roles.includes('admin');
      //this.showModeratorBoard = this.roles.includes('user');
      this.showUserBoard = this.roles.includes('user');
      this.username = user.username;
    }
    if(this.roles.includes('user')){
      this.router.navigate([''])
    }else if(this.roles.includes('admin')){
      this.router.navigate(['/admin'])
    }else if(this.roles.length==0){
      this.router.navigate(['/login'])
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
