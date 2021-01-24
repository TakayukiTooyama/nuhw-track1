import type { NextPage } from 'next';
import React from 'react';

import { Title } from '../../components/molecules';
import { Layout, ProfileCreate } from '../../components/templates';

const Profile: NextPage = () => (
  <>
    <Title title="プロフィール作成" />
    <Layout title="プロフィール作成" noHeader>
      <ProfileCreate />
    </Layout>
  </>
);

export default Profile;
