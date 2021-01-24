import Router from 'next/router';

import type { User, UserAuth, UserInfo } from '../../../models/users';
import { db } from '../../firebase';

const usersRef = db.collection('users');

// 新しいユーザーの認証情報をDBに追加
export const registerUserAuth = async (user: UserAuth): Promise<void> => {
  await usersRef
    .doc(user.uid)
    .set({
      uid: user.uid,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
};

/*
  Google認証後の画面遷移
  初回 → チーム参加画面
  以外 → ホーム画面
*/
export const navigationAfterAuth = async (user: UserAuth): Promise<void> => {
  await usersRef
    .doc(user.uid)
    .get()
    .then(async (doc) => {
      const data = doc.data() as UserInfo;
      if (data && data.teamInfo) {
        Router.push('/');
      } else {
        await registerUserAuth(user);
        Router.push('/teams/join');
      }
    });
};

/*
  チーム情報とプロフィール情報をすでに持っている場合(ログアウト後 & 起動時) → ホーム画面に遷移
  アカウント認証のみ行った場合 → チーム情報入力画面に遷移
  チーム情報だけ入力して間違って戻ってしまった場合 → プロフィール画面に遷移
*/
export const screenTransition = async (userAuth: UserAuth): Promise<void> => {
  await usersRef
    .doc(userAuth.uid)
    .get()
    .then((doc) => {
      const data = doc.data() as User;
      if (data && data.teamInfo && data.blockName) {
        Router.push('/');
        return;
      }
      if (!data) {
        Router.push('teams/join');
        return;
      }
      if (data && !data.blockName) {
        Router.push('/teams/profile');
      }
    });
};
