import type { NextPage } from 'next';
import React from 'react';

import { Layout, WeightViewDetail } from '../../components/templates';

const WeightView: NextPage = () => (
  <Layout title="ウエイト管理">
    <WeightViewDetail />
  </Layout>
);

export default WeightView;
