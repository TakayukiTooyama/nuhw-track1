import React from 'react';
import { NextPage } from 'next';

import { Title } from '../../components/molecules';
import { Layout, ProfileCreate } from '../../components/templates';

const Profile: NextPage = () => {
  return (
    <>
      <Title title="プロフィール作成" />
      <Layout title="プロフィール作成" noHeader={true}>
        <ProfileCreate />
      </Layout>
    </>
  );
};

export default Profile;
