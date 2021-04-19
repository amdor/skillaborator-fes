import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ParamMap,
  Params,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable()
export class OneTimeCodeInterceptor implements HttpInterceptor {
  constructor(private router: Router, private configService: ConfigService) {}

  private collectRouteParams(): Params {
    let params = {};
    const stack: ActivatedRouteSnapshot[] = [
      this.router.routerState.snapshot.root,
    ];
    while (stack.length > 0) {
      const route = stack.pop();
      params = { ...params, ...route.params };
      stack.push(...route.children);
    }
    return params;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const oneTimeCode = this.collectRouteParams().oneTimeCode;
    const questionEndpoint = this.configService.getQuestionEndpoint();
    if (oneTimeCode && req.url === questionEndpoint) {
      const newReq = req.clone({
        url: questionEndpoint + `/${oneTimeCode}`,
      });
      return next.handle(newReq);
    }
    return next.handle(req);
  }
}