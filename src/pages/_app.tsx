import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import '../../styles/tailwind.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
