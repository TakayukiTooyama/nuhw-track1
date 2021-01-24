import type { NextPage } from 'next';
import React from 'react';

import { Layout, TournamentEditDetail } from '../../components/templates';

const Tournament: NextPage = () => (
  <Layout title="大会結果">
    <TournamentEditDetail />
  </Layout>
);

export default Tournament;
