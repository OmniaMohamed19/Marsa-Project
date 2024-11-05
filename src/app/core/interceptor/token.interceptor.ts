import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
// import { AuthService } from '../auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private Language: string | null = null;

  constructor(private AuthService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authToken = this.AuthService.getToken();
    this.Language=localStorage.getItem('lang');

    const authRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken ? authToken : ''}`,
        'Accept': 'application/json',
        // 'App-Language': this.Language ? this.Language:'en',
      }
    });
    return next.handle(authRequest);
  }
}
