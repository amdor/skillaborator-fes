import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  accessToken$(authorizationCode: string): Observable<any> {
    const body = new HttpParams()
      .set('client_id', '779gcyc5z2xwnu')
      .set('code', authorizationCode)
      .set('grant_type', 'authorization_code')
      .set('client_secret', 'jZsocRSWp51Lt5gV')
      .set('redirect_uri', 'http://localhost:4200');

    return this.httpClient.post(
      'http://localhost:5000/linkedin-login',
      body.toString(),
      {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        ),
      }
    );
  }
}
