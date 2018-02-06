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

  keys: any;
  key: any;
  value: any;
  _user: User;

  ngOnInit() {
    this.authenticationService.userChanged().subscribe(
      (user: User) => {
        this._user = user;
      });
    if (this.authenticationService.checkCredentials()) {
      this.authenticationService.getUserInfo();
    };

  }



  getkeys() {
    this.http.get<any>('/demobapi/keys').subscribe(
      (response) => {
        
        this.keys = JSON.parse(response[0]);

      },
      (error) => {
        console.log(error.text());
      }
    )
  }


  getvalue(key) {
    this.key=key;
    this.http.get<any>('/demobapi/value?id='+key).subscribe(
      (response) => {
        this.value = atob(response[0].Value);
        
      },
      (error) => {
        console.log(error.text());
      }
    )
  }
}
