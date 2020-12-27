import { NextPage } from 'next';
import React from 'react';
import { Layout, ViewDetailWeight } from '../../components/templates';

const WeightView: NextPage = () => {
  return (
    <Layout title="ウエイト記録一覧">
      <ViewDetailWeight />
    </Layout>
  );
};

export default WeightView;
