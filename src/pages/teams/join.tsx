import { NextPage } from 'next';
import React from 'react';

import { Title } from '../../components/molecules';
import { Layout, TeamJoin } from '../../components/templates';

const TeamsJoinPage: NextPage = () => {
  return (
    <>
      <Title title="団体参加" />
      <Layout title="団体参加" noHeader={true}>
        <TeamJoin />
      </Layout>
    </>
  );
};

export default TeamsJoinPage;
