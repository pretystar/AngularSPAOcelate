import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
//import { UsermanagerComponent } from './usermanager/usermanager.component'
import { TableHttpExample } from './usermanager/table-http-example'

const routes: Routes = [
  { path: '', redirectTo: '/table', pathMatch: 'full' },
  //{ path: 'Usermanager', redirectTo: '/home', pathMatch: 'full' },
  // { path: 'home', loadChildren: "./home/home.component" },
  //{ path: 'usermanager', component: UsermanagerComponent },
  { path: 'table', component: TableHttpExample },
  //{ path: 'signup', component: SignupComponent },

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class UsermanagerroutingModule { }
