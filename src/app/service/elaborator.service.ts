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

export interface RequestProps {
  answerIds: string[];
  timedOut: boolean;
}

@Injectable({ providedIn: 'root' })
export class ElaboratorService {
  constructor(private httpClient: HttpClient, private config: ConfigService) {}

  private getQuestionWithEndpoint$(
    questionEndpoint: string,
    requestProps?: RequestProps
  ): Observable<Question> {
    if (!requestProps) {
      return this.httpClient.get<Question>(questionEndpoint);
    }

    const requestParams = this.getRequestParams(requestProps);

    return this.httpClient.get<Question>(questionEndpoint, {
      params: requestParams,
    });
  }

  getFirstQuestion$(oneTimeCode?: string): Observable<Question> {
    const questionEndpoint = oneTimeCode
      ? this.config.getQuestionEndpoint() + `/${oneTimeCode}`
      : this.config.getQuestionEndpoint();
    return this.getQuestionWithEndpoint$(questionEndpoint);
  }

  getNextQuestion$(props: { answerIds: string[]; timedOut: boolean }) {
    const questionEndpoint = this.config.getQuestionEndpoint();
    return this.getQuestionWithEndpoint$(questionEndpoint, props);
  }

  putSelectedAnswers$(requestProps: RequestProps): Observable<EvaluationResult> {
    const selectedAnswersEndpoint = this.config.getSelectedAnswersEndpoint();

    const requestParams = this.getRequestParams(requestProps);

    return this.httpClient.put<EvaluationResult>(
      selectedAnswersEndpoint,
      null,
      { params: requestParams }
    );
  }

  getSelectedAnswers$(): Observable<GetSelectedAnswersResponse> {
    const selectedAnswersEndpoint = this.config.getSelectedAnswersEndpoint();
    return this.httpClient.get<GetSelectedAnswersResponse>(
      selectedAnswersEndpoint
    );
  }

  private getRequestParams({ answerIds, timedOut }: RequestProps) {
    let requestParams = new HttpParams();
    answerIds.forEach(
      (answerId) => (requestParams = requestParams.append('answerId', answerId))
    );
    requestParams = requestParams.append('timedOut', timedOut.toString());
    return requestParams;
  }
}
