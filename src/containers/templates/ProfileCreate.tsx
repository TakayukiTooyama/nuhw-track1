import React, { useState } from 'react';
import Router from 'next/router';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import { userAuthState, userInfoState } from '../../recoil/user';
import { selectedTeamInfo } from '../../recoil/team';
import { db } from '../../lib/firebase';
import { UserInfo } from '../../models/users';
import { ProfileCreate } from '../../components/templates';

const EnhancedProfileCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  //Global State
  const setUserInfo = useSetRecoilState(userInfoState);
  const teamInfo = useRecoilValue(selectedTeamInfo);
  const user = useRecoilValue(userAuthState);

  //データベースにユーザー情報追加
  const addUserInfo = async (
    blockName: string,
    grade: string,
    gender: string
  ) => {
    setIsLoading(true);
    const usersRef = db.collection('users');
    const newData: UserInfo = {
      blockName,
      grade,
      gender,
      teamInfo: { teamId: teamInfo?.teamId!, teamName: teamInfo?.teamName! },
    };
    await usersRef
      .doc(user?.uid)
      .set(newData, { merge: true })
      .then(() => {
        setUserInfo(newData);
        Router.push('/');
      });
  };
  return <ProfileCreate addUserInfo={addUserInfo} isLoading={isLoading} />;
};

export default EnhancedProfileCreate;
