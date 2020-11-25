import React, { useEffect } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ReactQueryConfig, ReactQueryConfigProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';
import { ChakraProvider } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';

import customTheme from '../utils/theme';

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  const queryConfig: ReactQueryConfig = {
    shared: {
      suspense: true,
    },
    queries: {
      retry: 0,
      // useErrorBoundary: true,
    },
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ReactQueryConfigProvider config={queryConfig}>
        <ChakraProvider theme={customTheme}>
          <RecoilRoot>
            <Component {...pageProps} />
          </RecoilRoot>
        </ChakraProvider>
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </ReactQueryConfigProvider>
    </>
  );
};

export default App;
