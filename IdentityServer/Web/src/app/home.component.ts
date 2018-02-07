import { Component, OnInit } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SharedModule } from '../shared/shared.module'
import { AuthenticationService } from './user.AuthenticationService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private http: HttpClient) { }

  title = 'app';
  public _user: User;

  ngOnInit() {


  }
  
}
