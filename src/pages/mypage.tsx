import type { NextPage } from 'next';
import React from 'react';

import { Layout, ProfileDetail } from '../components/templates';

const Mypage: NextPage = () => (
  <Layout title="プロフィール">
    <ProfileDetail />
  </Layout>
);

export default Mypage;
