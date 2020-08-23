import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Question } from '../component/elaborator-question.model';

@Injectable({ providedIn: 'root' })
export class ElaboratorService {
  constructor(private httpClient: HttpClient, private config: ConfigService) {}

  getQuestion(level: number) {
    const questionEndpoint = this.config.getQuestionEndpoint();
    return this.httpClient.get<Question>(questionEndpoint, {
      params: new HttpParams({ fromString: 'level=' + level }),
    });
  }
}
