import Router from 'next/router';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { auth } from '../lib/firebase';
import { userAuthState } from '../recoil/users/user';

export const useAuthentication = () => {
  const [user, setUser] = useRecoilState(userAuthState);

  useEffect(() => {
    auth.onAuthStateChanged((firebaseUser) => {
      //まだ認証が終わっていない or ログアウト
      if (firebaseUser === null) {
        Router.push('/signin');
        return;
      }
      //認証完了 or GlobalStateに何も入っていない時
      if (user === undefined) {
        setUser({
          uid: firebaseUser?.uid!,
          photoURL: firebaseUser?.photoURL!,
          displayName: firebaseUser?.displayName!,
        });
        return;
      }
      //画面リフレッシュ時 or 画面遷移
      if (user !== null) {
        return;
      }
    });
  }, []);

  return { user };
};
