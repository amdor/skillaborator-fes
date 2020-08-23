import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  getQuestionEndpoint(): string {
    return environment.apiUrl + environment.questionEndpoint;
  }
}
