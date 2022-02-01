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
import ThemeProvider from '@/contexts/ThemeProvider';
import { StyledEngineProvider } from '@mui/material/styles';




const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/hop-protocol/hop-mainnet",
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <StyledEngineProvider injectFirst>
    <ThemeProvider>
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
    </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default MyApp
