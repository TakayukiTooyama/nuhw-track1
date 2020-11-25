import React from 'react';
import { Title } from '../../components/molecules';

import { Layout } from '../../components/templates';
import { TeamJoin } from '../../containers/templates';

const TeamsJoinPage = () => {
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
