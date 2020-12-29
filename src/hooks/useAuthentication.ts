import Router from 'next/router';
import { useEffect, useState } from 'react';

import { auth } from '../lib/firebase';
import { UserAuth } from '../models/users';

export const useAuthentication = () => {
  const [userAuth, setUserAuth] = useState<UserAuth | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((firebaseUser) => {
      //まだ認証が終わっていない or ログアウト
      if (firebaseUser === null) {
        Router.push('/signin');
        return;
      }
      //認証完了 or GlobalStateに何も入っていない時
      if (userAuth === null) {
        if (firebaseUser.photoURL === null) return;
        if (firebaseUser.displayName === null) return;
        setUserAuth({
          uid: firebaseUser.uid,
          photoURL: firebaseUser.photoURL,
          displayName: firebaseUser.displayName,
        });
        return;
      }
      //画面リフレッシュ時 or 画面遷移
      if (userAuth !== null) {
        return;
      }
    });
  }, [userAuth, setUserAuth]);

  return { userAuth };
};
