import { Component, OnInit } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SharedModule } from '../shared/shared.module'
import { AuthenticationService } from './user.AuthenticationService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private http: HttpClient) { }

  title = 'app';
  public userObservable = new Subject<User>();

  ngOnInit() {
    this.authenticationService.userChanged().subscribe(
      (user: User) => {
        this.userObservable.next(user)
      });
    this.authenticationService.scheduleRefresh();
    if (this.authenticationService.checkCredentials()) {
      this.authenticationService.getUserInfo();
    };

  }

  public signedin() {
    if (this.userObservable) {
      return true;
    }
    else {
      return false
    }
  }

  public signout() {
    this.authenticationService.logout();
  }



}
