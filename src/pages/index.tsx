import React from 'react';
import Home from '../components/templates/Home';
import Layout from '../components/templates/Layout';

const HomePage = () => {
  return (
    <Layout title="Home" bg="blue.50">
      <Home />
    </Layout>
  );
};

export default HomePage;
