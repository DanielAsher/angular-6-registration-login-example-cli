import { Component, OnInit } from '@angular/core'
import { Apollo } from 'apollo-angular'
import gql from 'graphql-tag'
import { PageQuery, Page } from '../_models/page'

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  queryResult: PageQuery
  pages: any[];
  // {
  //   return this.queryResult.data.pages
  // }
  loading = true
  error: any

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo
      .watchQuery({
        query: gql`
          query PagesOfPeterRabbit {
            pages(query: "") {
              uuid
              text
            }
          }
        `
      })
      .valueChanges.subscribe(result => {
        this.pages = result.data && result.data.pages
        this.loading = result.loading
        this.error = result.errors
      })
  }

}
