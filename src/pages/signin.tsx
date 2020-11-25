import Head from 'next/head';
import React from 'react';
import { SignIn } from '../containers/templates';

const SignInPage = () => {
  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <SignIn />
    </>
  );
};

export default SignInPage;
