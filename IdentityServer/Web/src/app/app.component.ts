import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from './user.AuthenticationService';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private authenticationService: AuthenticationService, private http: HttpClient) { }

  title = 'app';
  username = 'admin@gmail.com';
  password = 'Admin01*';
  keys: any;
  key: any;
  value: any;
  
  login() {
    this.authenticationService.login(this.username, this.password);
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
