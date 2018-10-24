import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User, Page, PageQuery } from '../_models';
import { UserService } from '../_services';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    pages: [Page];
    get expiryTime(): Date {
        return new Date(this.currentUser.access_token.token_data.expires * 1000)
    }
    get expired() : boolean {
        return new Date() > this.expiryTime
    }

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        // this.loadAllUsers();
        this.getGraphQLAdmin()
    }

    getGraphQLAdmin() {
        this.userService.getGraphQLAdmin().pipe(first()).subscribe( response => {
            this.pages = response.data.pages;
        })
    }

    // deleteUser(id: number) {
    //     this.userService.delete(id).pipe(first()).subscribe(() => { 
    //         this.loadAllUsers() 
    //     });
    // }

    private loadAllUsers() {
        // this.userService.getAll().pipe(first()).subscribe(users => { 
        //     this.users = users; 
        // });
    }
}