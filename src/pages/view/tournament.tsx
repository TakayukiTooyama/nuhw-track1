import type { NextPage } from 'next';
import React from 'react';

import { Layout, ViewDetailTournament } from '../../components/templates';

const TournamentView: NextPage = () => (
  <Layout title="ウエイト記録一覧">
    <ViewDetailTournament />
  </Layout>
);

export default TournamentView;
