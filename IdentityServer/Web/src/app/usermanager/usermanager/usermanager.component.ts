import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module'
import { AuthenticationService } from '../../user.AuthenticationService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';
//import { MatTableModule } from '@angular/material/table';
// import { MatTableModule } from '@angular/material';
// import { CdkTableModule } from '@angular/cdk/table';
// import { DataSource } from '@angular/cdk/table';
// import { DataSource } from '@angular/cdk';


import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';



import { User } from '../../../models/user';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Component({
  selector: 'app-usermanager',
  templateUrl: './usermanager.component.html',
  styleUrls: ['./usermanager.component.css']
})
export class UsermanagerComponent implements OnInit, AfterViewInit {

  //private _users: User[];//Array<User>;
  private _users = new BehaviorSubject<Array<User>>(new Array<User>())
  //public dataSource = new MatTableDataSource(this._users.value);
  public dataSource = new MatTableDataSource();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<User[]>("api/identity/getall", { headers: new HttpHeaders({ 'Accept': 'application/json' }) })
      .subscribe(
        users => {
          this._users.next(users);
          this.dataSource.data = this._users.value;
          //this.dataSource = new MatTableDataSource(this._users);

          this._users.subscribe(value => console.log("userchanged:"+ value));
        }
    );
  }

  displayedColumns = ['userName','givenName', 'familyName','lockoutEnabled','emailConfirmed','buttons'];
  

  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onupdate(user){
    console.log(user);
    
    this.http.post("api/identity/update",user, { headers: new HttpHeaders({ 'Accept': 'application/json' }) })
    .subscribe(
      result => {
        console.log(result)
      }
    );
  }

}
