import type { NextPage } from 'next';
import React from 'react';

import { Home, Layout } from '../components/templates';
import Test from './test';

const HomePage: NextPage = () => (
  <Layout title="Home">
    <Home />
    <Test />
  </Layout>
);

export default HomePage;
