import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, PageQuery } from '../_models';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getGraphQLAdmin(): Observable<PageQuery> {
        let query = '?operationName=PagesOfPeterRabbit&query=query%20PagesOfPeterRabbit%20%7B%0A%20%20pages(query%3A%20"")%20%7B%0A%20%20%20%20uuid%0A%20%20%20%20text%0A%20%20%7D%0A%7D'
        return this.http.get<PageQuery>(`${environment.apiUrl}/graphql/test-gql${query}`)
    }
    
    // getAll() {
    //     return this.http.get<User[]>(`${environment.apiUrl}/users`);
    // }

    // getById(id: number) {
    //     return this.http.get(`${environment.apiUrl}/users/` + id);
    // }

    // register(user: User) {
    //     return this.http.post(`${environment.apiUrl}/users/register`, user);
    // }

    // update(user: User) {
    //     return this.http.put(`${environment.apiUrl}/users/` + user.id, user);
    // }

    // delete(id: number) {
    //     return this.http.delete(`${environment.apiUrl}/users/` + id);
    // }
}