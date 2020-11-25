import React, { FC } from 'react';
import Router from 'next/router';

import { auth } from '../../lib/firebase';
import SignOut from '../../components/templates/SignOut';

const EnhancedSignOut: FC = () => {
  const logout = () => {
    auth.signOut().then(() => {
      Router.push('/signin');
    });
  };

  return <SignOut logout={logout} />;
};

export default EnhancedSignOut;
