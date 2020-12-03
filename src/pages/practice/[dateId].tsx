import { NextPage } from 'next';
import React from 'react';
import { Layout, PracticeViewDetail } from '../../components/templates';

const PracticeView: NextPage = () => {
  return (
    <Layout title="練習タイム">
      <PracticeViewDetail />
    </Layout>
  );
};

export default PracticeView;
