import { NextPage } from 'next';
import React from 'react';
import { Layout, TournamentViewDetail } from '../../components/templates';

const Tournament: NextPage = () => {
  return (
    <Layout title="大会結果" bg="green.50">
      <TournamentViewDetail />
    </Layout>
  );
};

export default Tournament;