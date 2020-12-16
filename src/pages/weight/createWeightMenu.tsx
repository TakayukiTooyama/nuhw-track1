import { NextPage } from 'next';

import { CreateWeightMenuDetail, Layout } from '../../components/templates';

const CreateWeightMenu: NextPage = () => {
  return (
    <Layout title="ウエイトメニューの追加" bg="blue.50">
      <CreateWeightMenuDetail />
    </Layout>
  );
};

export default CreateWeightMenu;
