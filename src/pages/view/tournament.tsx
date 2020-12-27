import { NextPage } from 'next';
import React from 'react';
import { Layout, ViewDetailTournament } from '../../components/templates';

const TournamentView: NextPage = () => {
  return (
    <Layout title="ウエイト記録一覧">
      <ViewDetailTournament />
    </Layout>
  );
};

export default TournamentView;
