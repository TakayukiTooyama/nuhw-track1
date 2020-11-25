import React from 'react';
import { Title } from '../../components/molecules';

import { Layout } from '../../components/templates';
import { TeamCreate } from '../../containers/templates';

const CreateTeams = () => {
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
