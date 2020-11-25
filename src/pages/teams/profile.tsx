import React from 'react';
import { Title } from '../../components/molecules';
import { Layout } from '../../components/templates';
import { ProfileCreate } from '../../containers/templates';

const Profile = () => {
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
