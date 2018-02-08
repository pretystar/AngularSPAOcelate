import { Component, OnInit } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SharedModule } from '../shared/shared.module'
import { AuthenticationService } from './user.AuthenticationService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private http: HttpClient) { }

  title = 'app';
  public _user: User;

  ngOnInit() {
    this.authenticationService.userChanged().subscribe(
      (user: User) => {
        this._user = user;
      });
    this.authenticationService.scheduleRefresh();
    if (this.authenticationService.checkCredentials()) {
      this.authenticationService.getUserInfo();
    };

  }

  



}
