import { Component, OnInit, OnDestroy } from '@angular/core'
import { Apollo, QueryRef } from 'apollo-angular'
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
const PagesOfPeterRabbitSub = gql`
  subscription PagesOfPeterRabbit {
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
  pagesQuery: QueryRef<any>
  pages$: Observable<any>
  queryResult: PageQuery
  pages: any[];
  loading = true
  error: any
  
  private querySubscription: Subscription

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    // this.querySubscription = this.apollo
    //   .watchQuery({
    //     query: PagesOfPeterRabbit
    //   })
    //   .valueChanges.subscribe(result => {
    //     this.pages = result.data && (result.data as any).pages
    //     this.loading = result.loading
    //     this.error = result.errors
    //   })
    this.pagesQuery = this.apollo
        .watchQuery({
          query: PagesOfPeterRabbit
        })
        
    this.pages$ = this.pagesQuery
        .valueChanges
        .pipe(map(({data}) => (data as any).pages))

    this.pagesQuery.subscribeToMore({
      document: PagesOfPeterRabbitSub,
      updateQuery: (prev, { subscriptionData}) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newPages = subscriptionData.data.pages
        return {
          ...prev,
          ...newPages
        }
      }
    })

    // setTimeout( () => {
    //   console.log('🔃 Refresh PagesOfPeterRabbit query')
    //   this.apollo
    //       .watchQuery({
    //         query: PagesOfPeterRabbit
    //       }).valueChanges.pipe(map(({data}) => (data as any).pages)).subscribe()
    // }, 20000)

  }
  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe()
    }
  }
}
