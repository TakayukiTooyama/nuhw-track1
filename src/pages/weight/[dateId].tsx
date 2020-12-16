import { NextPage } from 'next';
import React from 'react';

import { Layout, WeightViewDetail } from '../../components/templates';

const WeightView: NextPage = () => {
  return (
    <Layout title="ウエイト管理" bg="blue.50">
      <WeightViewDetail />
    </Layout>
  );
};

export default WeightView;
