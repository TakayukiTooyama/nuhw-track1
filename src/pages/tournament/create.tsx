import { NextPage } from 'next';

import { CreateTournamentMenuDetail, Layout } from '../../components/templates';

const CreateTournamentMenu: NextPage = () => {
  return (
    <Layout title="大会の追加" bg="green.50">
      <CreateTournamentMenuDetail />
    </Layout>
  );
};

export default CreateTournamentMenu;
