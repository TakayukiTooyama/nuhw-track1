import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import { SignIn } from '../components/templates';

const SignInPage: NextPage = () => (
  <>
    <Head>
      <title>Sign In</title>
    </Head>
    <SignIn />
  </>
);

export default SignInPage;
