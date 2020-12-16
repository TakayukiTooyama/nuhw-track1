import { NextPage } from 'next';
import React from 'react';
import { Layout, TournamentEditDetail } from '../../components/templates';

const Tournament: NextPage = () => {
  return (
    <Layout title="大会結果" bg="green.50">
      <TournamentEditDetail />
    </Layout>
  );
};

export default Tournament;
