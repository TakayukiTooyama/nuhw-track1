import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { SignIn } from '../components/templates';

const SignInPage: NextPage = () => {
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
