import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class TempService {
  constructor(private httpClient: HttpClient) {}

  getAvailableCode(): Observable<string> {
    const endpoint = environment.apiUrl + '/codes';
    return this.httpClient.get<string>(endpoint);
  }
}
