import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: 'home', loadChildren: "./home/home.component" },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  // { path: 'resources', loadChildren: './resources/resources.module#ResourcesModule' },
  // { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AccountRoutingModule { }
