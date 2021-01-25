import type { NextPage } from 'next';
import React from 'react';

import { Home, Layout } from '../components/templates';

const HomePage: NextPage = () => (
  <Layout title="Home">
    <Home />
  </Layout>
);

export default HomePage;
