import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module'
import { AuthenticationService } from '../../user.AuthenticationService';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  errorMessages: any="";

  model: any = {};

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  signup(): void {
    this.authenticationService.register(this.model)
      .subscribe(
      (res: any) => {
        // IdentityResult.
        if (res.succeeded) {
          // Signs in the user.
          //this.signin();
        } else {
          this.errorMessages = res.errors;
        }
      },
      (error: any) => {
        const errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : "Server error";
        console.log(errMsg);
        this.errorMessages.push({ description: "Server error. Try later." });
      });
  }

}
