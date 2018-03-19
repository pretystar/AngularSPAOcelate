import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'account', loadChildren: './account/account.module#AccountModule' },
  { path: 'usermanager', loadChildren: './usermanager/usermanager.module#UsermanagerModule'}
  // { path: 'resources', loadChildren: './resources/resources.module#ResourcesModule' },
  // { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
