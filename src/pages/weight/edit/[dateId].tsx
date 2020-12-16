import { NextPage } from 'next';
import React from 'react';

import { Layout, WeightEditDetail } from '../../../components/templates';

const WeightEdit: NextPage = () => {
  return (
    <Layout title="ウエイト管理" bg="blue.50">
      <WeightEditDetail />
    </Layout>
  );
};

export default WeightEdit;
