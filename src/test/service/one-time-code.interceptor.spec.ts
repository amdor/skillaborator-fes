import { HttpHandler, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { ConfigService } from 'src/app';
import { OneTimeCodeInterceptor } from '../../app/service/one-time-code.interceptor';

describe('OneTimeCodeInterceptorTests', () => {
  let nextMock: HttpHandler;
  let reqMock: any;
  let interceptor: OneTimeCodeInterceptor;
  let routeParamsMock: any;

  beforeEach(() => {
    routeParamsMock = {};
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            routerState: {
              snapshot: { root: { params: routeParamsMock, children: [] } },
            },
          },
        },
        OneTimeCodeInterceptor,
      ],
    });
    nextMock = { handle: jasmine.createSpy('handle') };
    reqMock = { url: '', clone: jasmine.createSpy('clone') };
  });

  describe("given there's no path params", () => {
    it('should not modify the request', () => {
      interceptor = TestBed.inject(OneTimeCodeInterceptor);
      interceptor.intercept(reqMock, nextMock);
      expect(nextMock.handle).toHaveBeenCalledWith(reqMock);
    });
  });

  describe('given there is a code in the path', () => {
    const questionEndpoint = 'http://localhost:4200/question';
    const elaboratorEndpoint = 'http://localhost:4200/elaborator';
    beforeEach(() => {
      routeParamsMock.oneTimeCode = 'ASFD';
      TestBed.overrideProvider(ConfigService, {
        useValue: {
          getQuestionEndpoint: () => questionEndpoint,
          getSelectedAnswersEndpoint: () => elaboratorEndpoint,
        },
      });
      reqMock.url = questionEndpoint;
      reqMock.clone.and.callFake((obj) => ({ ...reqMock, ...obj }));
      interceptor = TestBed.inject(OneTimeCodeInterceptor);
    });

    it('should add the code to the request url path', () => {
      interceptor.intercept(reqMock, nextMock);
      expect(nextMock.handle).toHaveBeenCalledWith(
        jasmine.objectContaining({ url: `${questionEndpoint}/ASFD` })
      );
    });
  });
});
