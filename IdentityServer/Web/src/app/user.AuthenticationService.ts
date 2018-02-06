import { Injectable } from '@angular/core';
//import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { interval } from 'rxjs/observable/interval';
import { AuthHttp, JwtHelper } from 'angular2-jwt';


@Injectable()
export class AuthenticationService {

  constructor(
    //private _router: Router,
    private http: HttpClient
  ) { }
  /**
  * user infor
  */
  private _user = new BehaviorSubject<User>(new User());
  /**
 * Scheduling of the refresh token.
 */
  private refreshSubscription: any;
  /**
 * Offset for the scheduling to avoid the inconsistency of data on the client.
 */
  private offsetSeconds: number = 30;


  public logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
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
       .subscribe((response) => {
           //response.access_token
          localStorage.setItem("access_token", response['access_token']);
          localStorage.setItem("refresh_token", response['refresh_token']);
          //this._router.navigate(['home']);
          this._user.next(null);
          this.getUserInfo();
        },
        (error: HttpErrorResponse) => {
           //console.log(error.message);
        }
      );
   }



  public checkCredentials() {
    let token = localStorage.getItem('access_token');
    if (token === null) {
      //this._router.navigate(['login']);
      return false;
    }
    let jwtHelper: JwtHelper = new JwtHelper();
    
    if (jwtHelper.isTokenExpired(token)) {
      return false;
    }
    return true;
    
  }

  public getUserToken() {
    if (localStorage.getItem('access_token') === null) {
      console.log('please login');
      //this._router.navigate(['users/login']);
    } else {
      return localStorage.getItem('access_token');
    }
  }

  /**
     * Strategy for refresh token through a scheduler.
     * Will schedule a refresh at the appropriate time.
     */
  //public scheduleRefresh(): void {
  //  const source: Observable<number> = interval(
  //    this.calcDelay(this.getAuthTime())
  //  );

  //  this.refreshSubscription = source.subscribe(() => {
  //    this.http.post("", "").subscribe(
  //      (response) => { },
  //      (error) => { }
  //    );
  //  });
  //}

  private unscheduleRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  //private calcDelay(time: number): number {
  //  let jwtHelper: JwtHelper = new JwtHelper();
  //  if (this.checkCredentials()) {
  //    let token = localStorage.getItem('access_token');
  //    const expiresAt: number = jwtHelper.getTokenExpirationDate(token);
  //    const delay: number = expiresAt - time - this.offsetSeconds * 1000;
  //    return delay > 0 ? delay : 0;
  //  }

  //}

  //private getAuthTime(): number {
  //  return parseInt(localStorage.getItem('access_token_stored_at'), 10);
  //}
  /**
   * *********
   */
  public register() {

  }
  public userChanged(): Observable<User> {
    return this._user.asObservable();
  }
  public getUserInfo() {
    if (this._user.value == null) {
        let contentHeaders1 = new HttpHeaders({ 'Accept': 'application/json' });

        this.http.get("connect/userinfo", { headers: contentHeaders1 }).subscribe(
          (user: User) => { this._user.next(user) },
          (error: HttpErrorResponse) => { console.log(error.message); }
      );
      
    }
    return this._user.value;
  }
}
