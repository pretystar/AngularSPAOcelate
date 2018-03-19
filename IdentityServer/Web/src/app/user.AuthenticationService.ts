import { Injectable } from '@angular/core';
//import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { interval } from 'rxjs/observable/interval';
import { map, catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';

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
  private offsetSeconds: number = 300;
  private jwtHelper: JwtHelper = new JwtHelper();

  public logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  public login(username, password): Observable<any> {
     //event.preventDefault();
     //let body = JSON.stringify({ username, password });
    let contentHeaders = new HttpHeaders();
    contentHeaders = contentHeaders.set('Accept', 'application/json');
    contentHeaders = contentHeaders.set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');

    let body = `grant_type=password&client_id=AngularSPA&scope=openid+offline_access+WebAPI+profile+roles&username=${username}&password=${password}`;
    return this.http.post("connect/token", body, { headers: contentHeaders })
      .pipe(
      map((response) => {
        localStorage.setItem("access_token", response['access_token']);
        localStorage.setItem("refresh_token", response['refresh_token']);
        //this._user.next(null);
        this.scheduleRefresh();
      }),
      catchError((error: HttpErrorResponse) => {
        return _throw(error);
      }));  
   }



  public checkCredentials() {
    let token = localStorage.getItem('access_token');
    if (token === null) {
      //this._router.navigate(['login']);
      return false;
    }
    if (this.jwtHelper.isTokenExpired(token)) {
      return false;
    }
    return true;
  }

  public getUserToken() {
    if (this.checkCredentials()) {
      console.log('please login');
    } else {
      return localStorage.getItem('access_token');
    }
  }

  /**
     * Strategy for refresh token through a scheduler.
     * Will schedule a refresh at the appropriate time.
     */
  public scheduleRefresh(): void {
    //const source: Observable<number> = interval(
    //  this.calcDelay(this.getAuthTime())
    //);
    if (this.checkCredentials()) {
      const source: Observable<number> = interval(
        this.offsetSeconds * 1000
      );

      this.refreshSubscription = source.subscribe(() => {
        console.log('refresh token');
        let refresh_token = localStorage.getItem('refresh_token')
        let body = `grant_type=refresh_token&refresh_token=${refresh_token}&client_id=AngularSPA`
          this.http.post("connect/token", body, { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }) }).subscribe(
            (response) => {
              localStorage.setItem("access_token", response['access_token']);
              localStorage.setItem("refresh_token", response['refresh_token']);
            },
            (error) => { }
        );
      });
    }
  }

  private unscheduleRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  //private calcDelay(time: number): number {
  //  let delay: number = 5;
  //  if (this.checkCredentials()) {
  //    let token = localStorage.getItem('access_token');
  //    const expiresAt: number = this.jwtHelper.getTokenExpirationDate(token).getTime();
  //    delay = expiresAt - time - this.offsetSeconds * 1000;
  //  }
  //  return delay > 0 ? delay : 0;
  //}

  //private getAuthTime(): number {
  //  let token = localStorage.getItem('access_token');
    
  //  return this.jwtHelper.decodeToken(token).auth_time;
  //  //return parseInt(localStorage.getItem('access_token'), 10);
  //}
  /**
   * *********
   */
  public register(model: any): Observable<any> {
    const body: string = JSON.stringify(model);

    // Sends an authenticated request.
    return this.http.post("/api/identity/Create", body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(
      map((response: Response) => {
        return response;
      }),
      catchError((error: any) => {
        return _throw(error);
      }));
  }

  public userChanged(): Observable<User> {
    return this._user.asObservable();
  }
  public getUserInfo() {
    if (this._user.value["userName"] == null) {
      this.http.get<User>("connect/userinfo", { headers: new HttpHeaders({ 'Accept': 'application/json' }) })
      //  .pipe(
      //  map((user: User) => {
      //    console.log("map");
      //    console.log(user);
      //      this._user.next(user)
      //      //this._user.value;
      //    }),
      //    catchError((error: HttpErrorResponse) => {
      //      return _throw(error);
      //    })
      //)
        .subscribe(
        user => {
            console.log("subscribe");
            console.log(user);
            this._user.next(user);
        },
        (error) => { }
        );      
    }
  }
}
