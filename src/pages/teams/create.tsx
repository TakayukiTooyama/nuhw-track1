import { NextPage } from 'next';
import React from 'react';
import { Title } from '../../components/molecules/index';

import { Layout, TeamCreate } from '../../components/templates';

const CreateTeams: NextPage = () => {
  return (
    <>
      <Title title="団体作成" />
      <Layout title="団体作成" noHeader={true}>
        <TeamCreate />
      </Layout>
    </>
  );
};

export default CreateTeams;
