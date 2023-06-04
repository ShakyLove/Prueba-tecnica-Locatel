import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators/';
import jwt_decode from 'jwt-decode';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class AccoutService {

  userToken: string;

  constructor(private http: HttpClient) { }

  login(data) {
    return this.http.post(`${API_URL}login/`, data).pipe(
      map((res:any) => {
        this.saveToken(res.token)
        return res;
      })
    );
  }

  saveToken(token: string) {
    this.userToken = token;
    localStorage.setItem('userToken', token);
  }

  readToken() {
    if (localStorage.getItem('userToken')) {
      this.userToken = localStorage.getItem('userToken');
    } else {
      this.userToken = null;
    }

    return this.userToken;
  }

  decryptToken(): any {
    var token = this.readToken();
    if (token === null) {
      return null;
    } else {
      var decoded = jwt_decode(token);
      return decoded;
    }
  }

  register(data) {
    return this.http.post(`${API_URL}register/`, data).pipe(
      map((res:any) => {
        return res;
      })
    );
  }

  getInfo(id) {
    return this.http.get(`${API_URL}account/${id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  movements(data) {
    return this.http.post(`${API_URL}movement/`, data).pipe(
      map((res:any) => {
        return res;
      })
    );
  }
}
