import { Injectable } from '@angular/core';
//import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class AuthenticationService {

  constructor(
    //private _router: Router,
    private http: HttpClient
  ) { }

  private _user = new BehaviorSubject<User>(new User());
  public logout() {
    localStorage.removeItem('access_token');
    //this._router.navigate(['login']);
  }

  public login(username, password) {
     //event.preventDefault();
     //let body = JSON.stringify({ username, password });
    let contentHeaders = new HttpHeaders();
    contentHeaders = contentHeaders.set('Accept', 'application/json');
    contentHeaders = contentHeaders.set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');

    let body = `grant_type=password&client_id=AngularSPA&scope=openid+offline_access+WebAPI+profile+roles&username=${username}&password=${password}`;
    this.http.post("connect/token", body, { headers: contentHeaders })
       .subscribe(
      (response) => {
           //response.access_token
        for (var key in response) {
          localStorage.setItem(key, response[key]);
        }
           //this._router.navigate(['home']);
        let contentHeaders1 = new HttpHeaders({ 'Accept': 'application/json'});

        this.http.get("connect/userinfo", { headers: contentHeaders1 }).subscribe(
          (user: User) => { this._user.next(user) },
             (error: HttpErrorResponse) => { console.log(error.message); }
           );
         },
         (error: HttpErrorResponse) => {
           //console.log(error.message);
         }
       );
   }

  public checkCredentials() {
    if (localStorage.getItem('access_token') === null) {
      //this._router.navigate(['login']);
      return false;
    }
  }

  public getUserToken() {
    if (localStorage.getItem('access_token') === null) {
      console.log('please login');
      //this._router.navigate(['users/login']);
    } else {
      return localStorage.getItem('access_token');
    }
  }

  public register() {

  }
  public userChanged(): Observable<User> {
    return this._user.asObservable();
  }
  public getUserInfo() {
    if (this._user == null) {
      return this._user.value;
    }
  }
}
