import { NextPage } from 'next';
import React from 'react';
import { Layout, ViewDetail } from '../../components/templates';

const View: NextPage = () => {
  return (
    <Layout title="記録閲覧">
      <ViewDetail />
    </Layout>
  );
};

export default View;
