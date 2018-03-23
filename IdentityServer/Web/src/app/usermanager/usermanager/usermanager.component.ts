import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module'
import { AuthenticationService } from '../../user.AuthenticationService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';
//import { MatTableModule } from '@angular/material/table';
import { MatTableModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { DataSource } from '@angular/cdk/table';
// import { DataSource } from '@angular/cdk';




import { User } from '../../../models/user';
import { MatPaginatorModule } from '@angular/material/paginator';


@Component({
  selector: 'app-usermanager',
  templateUrl: './usermanager.component.html',
  styleUrls: ['./usermanager.component.css']
})
export class UsermanagerComponent implements OnInit, AfterViewInit {

  private _users: User[];//Array<User>;
  public dataSource = new MatTableDataSource(this._users);

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<User[]>("api/identity/getall", { headers: new HttpHeaders({ 'Accept': 'application/json' }) })
      .subscribe(
      users => {
        this._users = users;
        this.dataSource.data = this._users;
        //this.dataSource = new MatTableDataSource(this._users);
      }
    );
  }

  displayedColumns = ['userName','givenName', 'familyName'];
  

  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
