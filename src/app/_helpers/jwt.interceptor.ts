import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { User } from '../_models'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if ( request.url.startsWith(environment.apiUrl) == false) {
            return next.handle(request);
        }
        // add authorization header with jwt token if available
        let currentUser = <User>JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.access_token.token) {
            request = request.clone({
                setHeaders: { 
                    'Authorization': `${currentUser.access_token.token}`,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
                }
            });
        }

        return next.handle(request);
    }
}