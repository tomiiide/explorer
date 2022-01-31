import '../styles/globals.css'
import '../styles/vars.css'
import type { AppProps } from 'next/app'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import * as React from 'react';
import ColorModeProvider from '@/contexts/ColorMode';



const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/hop-protocol/hop-mainnet",
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <ColorModeProvider>
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
    </ColorModeProvider>
  );
}

export default MyApp
