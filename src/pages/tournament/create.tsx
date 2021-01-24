import type { NextPage } from 'next';

import { CreateTournamentMenuDetail, Layout } from '../../components/templates';

const CreateTournamentMenu: NextPage = () => (
  <Layout title="大会の追加">
    <CreateTournamentMenuDetail />
  </Layout>
);

export default CreateTournamentMenu;
