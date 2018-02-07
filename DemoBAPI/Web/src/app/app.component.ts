import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http: HttpClient){}
  title = 'app';

  keys: any;
  key: any;
  value: any;

  getkeys() {
    this.http.get<any>('/demobapi/keys').subscribe(
      (response) => {

        this.keys = JSON.parse(response[0]);

      },
      (error) => {
        console.log(error.text());
      }
    )
  }


  getvalue(key) {
    this.key = key;
    this.http.get<any>('/demobapi/value?id=' + key).subscribe(
      (response) => {
        this.value = atob(response[0].Value);

      },
      (error) => {
        console.log(error.text());
      }
    )
  }
}
