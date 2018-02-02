import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
//import { AuthenticationService } from './user.AuthenticationService';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  //constructor(private auth: AuthenticationService) { }
  

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authHeader: any;
    // Get the auth header from the service.


    if (localStorage.getItem('access_token') === null) {
      console.log('please login');
      //this._router.navigate(['users/login']);
      //const authReq = req.clone({ headers: req.headers.set('Content-Type', 'application/x-www-form-urlencoded') });
      return next.handle(req);
    } else {
      authHeader = localStorage.getItem('access_token');
      const authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + authHeader) });
      // Pass on the cloned request instead of the original request.
      console.log(authReq);
      return next.handle(authReq);
    }
  }
}
