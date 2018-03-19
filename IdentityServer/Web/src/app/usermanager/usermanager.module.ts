import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AuthenticationService } from '../user.AuthenticationService';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../AuthInterceptor';
import { UsermanagerroutingModule } from './usermanagerrouting.module';

import { UsermanagerComponent } from './usermanager/usermanager.component'

@NgModule({
  imports: [
    CommonModule,
    UsermanagerroutingModule
  ],
  providers: [
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  declarations: [
    UsermanagerComponent
  ],
  bootstrap: [UsermanagerComponent]
})
export class UsermanagerModule { }
