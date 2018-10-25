import { Component, OnInit, OnDestroy } from '@angular/core'
import { Apollo } from 'apollo-angular'
import gql from 'graphql-tag'
import { PageQuery, Page } from '../_models/page'
import { Subscription, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const PagesOfPeterRabbit = gql`
  query PagesOfPeterRabbit {
    pages(query: "") {
      uuid
      text
    }
  }
`


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit, OnDestroy {
  pages$: Observable<any>
  queryResult: PageQuery
  pages: any[];
  loading = true
  error: any
  
  private querySubscription: Subscription

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.querySubscription = this.apollo
      .watchQuery({
        query: PagesOfPeterRabbit
      })
      .valueChanges.subscribe(result => {
        this.pages = result.data && (result.data as any).pages
        this.loading = result.loading
        this.error = result.errors
      })
    
      this.pages$ = this.apollo
          .watchQuery({
            query: PagesOfPeterRabbit
          })
          .valueChanges
          .pipe(map(({data}) => (data as any).pages))
    setTimeout( () => {
      console.log('🔃 Refresh PagesOfPeterRabbit query')
      this.apollo
          .watchQuery({
            query: PagesOfPeterRabbit
          }).valueChanges.pipe(map(({data}) => (data as any).pages)).subscribe()
    }, 20000)

  }
  ngOnDestroy() {
    this.querySubscription.unsubscribe()
  }
}
