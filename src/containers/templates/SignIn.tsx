import Router from 'next/router';
import { FC, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import SignIn from '../../components/templates/SignIn';
import { useAuthentication } from '../../hooks/useAuthentication';
import { auth, db, provider } from '../../lib/firebase';
import { User } from '../../models/users';
import { loadingState } from '../../recoil/user';

const EnhancedSignIn: FC = () => {
  const { user } = useAuthentication();
  const setLoading = useSetRecoilState(loadingState);

  const fetchTeamInfo = async (uid: string) => {
    const usersRef = db.collection('users');
    await usersRef
      .doc(uid)
      .get()
      .then((doc) => {
        const data = doc.data() as User;
        if (data === undefined) {
          Router.push('/teams');
        } else {
          Router.push('/');
        }
      });
  };

  useEffect(() => {
    auth.getRedirectResult().then((result) => {
      if (result.user || auth.currentUser) {
        if (result.user !== null) {
          fetchTeamInfo(result.user?.uid!);
        }
      } else {
        setLoading(true);
      }
    });
  }, [user]);

  const login = () => {
    auth.signInWithRedirect(provider);
  };

  return <SignIn login={login} />;
};

export default EnhancedSignIn;
