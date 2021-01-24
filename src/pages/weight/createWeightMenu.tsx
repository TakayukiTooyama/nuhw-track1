import type { NextPage } from 'next';

import { CreateWeightMenuDetail, Layout } from '../../components/templates';

const CreateWeightMenu: NextPage = () => (
  <Layout title="ウエイトメニューの追加">
    <CreateWeightMenuDetail />
  </Layout>
);

export default CreateWeightMenu;
