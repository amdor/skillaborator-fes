import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  getQuestionEndpoint(): string {
    return environment.apiUrl + environment.questionEndpoint;
  }
}
