import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthenticationService } from '../user.AuthenticationService';
import { SigninComponent } from './signin/signin.component';
import { AccountRoutingModule } from './accountrouting.module.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../AuthInterceptor';
//import { BrowserModule } from '@angular/platform-browser';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    SharedModule,
    AccountRoutingModule,
    //BrowserModule,
    //BrowserAnimationsModule
  ],
  providers: [
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
    ],
  declarations: [SigninComponent],
  bootstrap: [SigninComponent]
})
export class AccountModule { }
