import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/auth`, 
            {
                "app_id":"",
                "provider":"password",
                "data": username,
                "user_info": {
                "register": false,
                "password": password
                }
            })
            .pipe(
                concatMap( user => {
                    return this.http.post<any>(`${environment.apiUrl}/auth`, 
                    {
                        "app_id":"",
                        "provider":"realm", // Note provider is 'realm'
                        "data": user.refresh_token.token, // Token from previous response
                        "path":"books" // Path of the realm you want to access, e.g. '/user-id/tickets
                    }
                    )
                }),
                map(user => {
                // login successful if there's a jwt token in the response
                console.log("🔑 Auth response: ", user)
                if (user && user.access_token) {
                    user.username = username;
                    user.password = password;
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }),
            );
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}