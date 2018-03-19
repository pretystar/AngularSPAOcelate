import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module'
import { AuthenticationService } from '../../user.AuthenticationService';
//import { Route } from '@angular/router';

@Component({
  selector: 'account-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  username = 'admin@gmail.com';

  password = 'Admin01*';

  //constructor(private authenticationService: AuthenticationService, private route: Route) { }
  constructor(private authenticationService: AuthenticationService) { }
  ngOnInit() {
  }

  login() {
    this.authenticationService.login(this.username, this.password).subscribe(
      (response) => {
        this.authenticationService.getUserInfo();
      },
      (error) => { }
    );
    //this.route.redirectTo('/home');
  }
}
