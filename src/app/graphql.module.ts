import { NgModule } from '@angular/core'
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular'
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { environment } from '../environments/environment'
import { longStackSupport } from 'q';

const uri = `${environment.apiUrl}/graphql/test-gql`; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink) {

  const httpLinkHandler = httpLink.create({uri})
  // Create a WebSocket link:
  const ws = new WebSocketLink({
    uri: `wss://storysmarties.us1.cloud.realm.io:443/graphql/%2Ftest-gql`,
    options: {
      reconnect: true,
      connectionParams: () => {
        const user = JSON.parse(localStorage.getItem('currentUser'))
        const token = user.access_token && user.access_token.token
        if (token) {
          return { token }
        } else {
          return { }
        }
      }
    }
  });
  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    ws,
    httpLinkHandler,
  )
  return {
    link: httpLinkHandler,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
