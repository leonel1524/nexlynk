import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokensStr = localStorage.getItem('nexlynk_tokens');

    if (tokensStr) {
      try {
        const tokens = JSON.parse(tokensStr);
        if (tokens.access_token) {
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${tokens.access_token}`
            }
          });
          return next.handle(cloned);
        }
      } catch {
        // ignore parse errors
      }
    }

    return next.handle(req);
  }
}
