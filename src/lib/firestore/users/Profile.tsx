/* eslint-disable import/prefer-default-export */
import Router from 'next/router';

import type { Profile, UserAuth } from '../../../models/users';
import { db } from '../../firebase';

const usersRef = db.collection('users');

// ユーザープロフィール情報を追加
export const addProfileInfo = async (
  blockName: string,
  grade: string,
  gender: string,
  userAuth: UserAuth | null,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  setIsLoading(true);
  if (userAuth === null) return;
  const newData: Profile = {
    blockName,
    grade,
    gender,
  };
  await usersRef
    .doc(userAuth.uid)
    .update(newData)
    .then(() => {
      Router.push('/');
    });
};
