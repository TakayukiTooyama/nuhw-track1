import { NextPage } from 'next';
import React from 'react';

import { Home, Layout } from '../components/templates';

const HomePage: NextPage = () => {
  return (
    <Layout title="Home" bg="blue.50">
      <Home />
    </Layout>
  );
};

export default HomePage;
