import React, { FC, useState } from 'react';
import Router from 'next/router';
import { Box, Stack } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { db } from '../../../lib/firebase';
import SelectMenu from '../../molecules/common/SelectMenu1';
import { FormButton, SelectRadio } from '../../molecules/index';
import { User } from '../../../models/users';
import { selectedTeamInfo } from '../../../recoil/teams/team';
import {
  ParticipatedTournamentIds,
  userState,
} from '../../../recoil/users/user';

const ProfileCreate: FC = () => {
  //Global State
  const [user, setUser] = useRecoilState(userState);
  const teamInfo = useRecoilValue(selectedTeamInfo);
  const tournamentIds = useRecoilValue(ParticipatedTournamentIds);

  //Local State
  const [gender, setGender] = useState('男'),
    [grade, setGrade] = useState('1年'),
    [blockName, setBlockName] = useState('ミドルブロック'),
    [isLoading, setIsLoading] = useState(false);

  //Radio & Selectの内容
  const gradeContents = ['1年', '2年', '3年', '4年'];
  const blocks = ['短距離ブロック', 'ミドルブロック'];
  const genderContents = ['男', '女'];

  //データベースにユーザー情報追加
  const addUserInfo = async (
    blockName: string,
    grade: string,
    gender: string
  ) => {
    if (teamInfo === null) return;
    setIsLoading(true);
    const usersRef = db.collection('users');
    if (user === null) return;
    const newData: User = {
      ...user,
      blockName,
      grade,
      gender,
      teamInfo: { teamId: teamInfo.teamId, teamName: teamInfo.teamName },
      tournamentIds,
    };
    await usersRef
      .doc(user.uid)
      .set(newData, { merge: true })
      .then(() => {
        setUser(newData);
        Router.push('/');
      });
  };

  return (
    <>
      <SelectMenu label={blockName} contents={blocks} setName={setBlockName} />
      <Box mb={10}></Box>
      <Stack spacing={4}>
        <SelectRadio
          value={grade}
          setValue={setGrade}
          contents={gradeContents}
        />
        <SelectRadio
          value={gender}
          contents={genderContents}
          setValue={setGender}
        />
      </Stack>
      <Box mb={10}></Box>
      <FormButton
        label="作成"
        bg="blue.400"
        onClick={() => addUserInfo(blockName, grade, gender)}
        isLoading={isLoading}
      >
        作成
      </FormButton>
    </>
  );
};

export default ProfileCreate;
