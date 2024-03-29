import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
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
			const route = stack.pop()!;
			params = { ...params, ...route.params };
			stack.push(...route.children);
		}
		return params;
	}

	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const { oneTimeCode } = this.collectRouteParams();
		if (!oneTimeCode) {
			return next.handle(req);
		}
		let matchedEndpoint: string;
		const questionEndpoint = this.configService.getQuestionEndpoint();
		const elaboratorEndpoint =
			this.configService.getSelectedAnswersEndpoint();
		switch (req.url) {
			case `${questionEndpoint}`:
				matchedEndpoint = questionEndpoint;
				break;
			case `${elaboratorEndpoint}`:
				matchedEndpoint = elaboratorEndpoint;
				break;
		}
		if (matchedEndpoint!) {
			const newReq = req.clone({
				url: matchedEndpoint + `/${oneTimeCode}`,
			});
			return next.handle(newReq);
		}
		return next.handle(req);
	}
}
