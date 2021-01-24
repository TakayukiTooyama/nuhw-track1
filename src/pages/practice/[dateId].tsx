import type { NextPage } from 'next';
import React from 'react';

import { Layout, PracticeViewDetail } from '../../components/templates';

const PracticeView: NextPage = () => (
  <Layout title="練習タイム">
    <PracticeViewDetail />
  </Layout>
);

export default PracticeView;
