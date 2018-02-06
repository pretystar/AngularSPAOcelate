import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module'
import { AuthenticationService } from '../../user.AuthenticationService';

@Component({
  selector: 'account-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  username = 'admin@gmail.com';
  password = 'Admin01*';
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }
  login() {
    this.authenticationService.login(this.username, this.password);
  }
}
