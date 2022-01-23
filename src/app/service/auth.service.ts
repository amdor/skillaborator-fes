import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { LoginResponse } from './services.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
	constructor(
		private httpClient: HttpClient,
		private configService: ConfigService
	) {}

	accessToken$(authorizationCode: string): Observable<LoginResponse> {
		const body = new HttpParams()
			.set('client_id', '779gcyc5z2xwnu')
			.set('code', authorizationCode)
			.set('grant_type', 'authorization_code')
			.set('client_secret', 'jZsocRSWp51Lt5gV')
			.set('redirect_uri', window.location.href);

		return this.httpClient.post<LoginResponse>(
			this.configService.getLinkedInLoginEndpoint(),
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
