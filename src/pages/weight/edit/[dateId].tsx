import type { NextPage } from 'next';
import React from 'react';

import { Layout, WeightEditDetail } from '../../../components/templates';

const WeightEdit: NextPage = () => (
  <Layout title="ウエイト管理">
    <WeightEditDetail />
  </Layout>
);

export default WeightEdit;
