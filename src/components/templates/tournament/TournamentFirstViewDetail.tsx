import { Box, Text } from '@chakra-ui/react';
import React, { VFC } from 'react';
import { QueryFunctionContext, useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';

import { db } from '../../../lib/firebase';
import { TournamentData } from '../../../models/users';
import { userState } from '../../../recoil/users/user';
import { Heading1, LinkButton } from '../../molecules';
import { TournamentDataTable } from '../../oraganisms';

const TournamentFirstViewDetail: VFC = () => {
  // Global State
  const user = useRecoilValue(userState);
  const teamId = user?.teamInfo.teamId;

  // team内で登録されている大会の情報を取得
  const fetchTournametData = async (context: QueryFunctionContext<string>) => {
    const teamId = context.queryKey[1];
    const tournamentMenusRef = db
      .collection('teams')
      .doc(teamId)
      .collection('tournamentMenus')
      .orderBy('startDate', 'desc');
    return await tournamentMenusRef.get().then((snapshot) => {
      const tournamentDataList: TournamentData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as TournamentData;
        tournamentDataList.push(data);
      });
      return tournamentDataList;
    });
  };

  const { data } = useQuery(['tournamentMenus', teamId], fetchTournametData, {
    enabled: !!teamId,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <Heading1 label="大会一覧" />
      <Box my={8}>
        {data && data?.length > 0 ? (
          <TournamentDataTable dataList={data} />
        ) : (
          <Text textAlign="center">まだ大会が登録されていません。</Text>
        )}
      </Box>
      <LinkButton
        w="100%"
        label="追加したい大会がない場合"
        link="/tournament/create"
      />
    </>
  );
};

export default TournamentFirstViewDetail;
