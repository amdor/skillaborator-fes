import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import {
  Question,
  SelectedAnswer,
  EvaluationResult,
  GetSelectedAnswersResponse,
} from '../component/elaborator-question.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ElaboratorService {
  constructor(private httpClient: HttpClient, private config: ConfigService) {}

  getQuestion({
    answerIds,
    oneTimeCode,
  }: {
    answerIds?: string[];
    oneTimeCode?: string;
  }): Observable<Question> {
    const questionEndpoint = oneTimeCode
      ? this.config.getQuestionEndpoint() + `/${oneTimeCode}`
      : this.config.getQuestionEndpoint();

    let requestParams = new HttpParams();

    answerIds?.forEach(
      (answerId) => (requestParams = requestParams.append('answerId', answerId))
    );

    return this.httpClient.get<Question>(questionEndpoint, {
      params: requestParams,
    });
  }

  putSelectedAnswers(answerIds: string[]): Observable<EvaluationResult> {
    const selectedAnswersEndpoint = this.config.getSelectedAnswersEndpoint();
    let requestParams = new HttpParams();

    answerIds.forEach(
      (answerId) => (requestParams = requestParams.append('answerId', answerId))
    );

    return this.httpClient.put<EvaluationResult>(
      selectedAnswersEndpoint,
      null,
      {
        params: requestParams,
      }
    );
  }

  getSelectedAnswers(): Observable<GetSelectedAnswersResponse> {
    const selectedAnswersEndpoint = this.config.getSelectedAnswersEndpoint();
    return this.httpClient.get<GetSelectedAnswersResponse>(
      selectedAnswersEndpoint
    );
  }
}
