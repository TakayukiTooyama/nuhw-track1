import { NextPage } from 'next';
import React from 'react';
import { Layout, PracticeEditDetail } from '../../../components/templates';

const PracticeEdit: NextPage = () => {
  return (
    <Layout title="練習タイム" bg="orange.50">
      <PracticeEditDetail />
    </Layout>
  );
};

export default PracticeEdit;
