import { NextPage } from 'next';
import React from 'react';

import { Layout, TournamentFirstViewDetail } from '../../components/templates';

const searchTouranament: NextPage = () => {
  return (
    <Layout title="大会結果" bg="green.400">
      <TournamentFirstViewDetail />
    </Layout>
  );
};

export default searchTouranament;
