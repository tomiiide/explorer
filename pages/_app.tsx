import '../styles/globals.css'
import '../styles/vars.css'
import type { AppProps } from 'next/app'
import * as React from 'react';
import ThemeProvider from '@/contexts/ThemeProvider';
import { StyledEngineProvider } from '@mui/material/styles';

function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <StyledEngineProvider injectFirst>
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default MyApp
