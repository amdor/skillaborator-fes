import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable()
export class OneTimeCodeInterceptor implements HttpInterceptor {
  constructor(
    private route: ActivatedRoute,
    private configService: ConfigService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.route.paramMap.pipe(
      switchMap((paramMap: ParamMap) => {
        const oneTimeCode = paramMap.get('oneTimeCode');
        const questionEndpoint = this.configService.getQuestionEndpoint();
        if (oneTimeCode && req.url === questionEndpoint) {
          const newReq = req.clone({
            url: questionEndpoint + `/${oneTimeCode}`,
          });
          return next.handle(newReq);
        }
        return next.handle(req);
      })
    );
  }
}
