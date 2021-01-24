/* eslint-disable import/prefer-default-export */
import { SetterOrUpdater } from 'recoil';

import { User, UserAuth } from '../../../models/users';
import { db } from '../../firebase';

const usersRef = db.collection('users');

// ユーザーの情報を取得
export const fetchUserInfo = async (
  userAuth: UserAuth,
  setUser: SetterOrUpdater<User | null>
): Promise<void> => {
  await usersRef
    .doc(userAuth.uid)
    .get()
    .then((doc) => {
      const data = doc.data() as User;
      setUser(data);
    });
};
