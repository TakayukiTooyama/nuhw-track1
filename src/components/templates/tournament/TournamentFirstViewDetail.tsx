import { Box, Spinner, Stack, Text } from '@chakra-ui/react';
import React, { useState, VFC } from 'react';
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

  // Local State
  const [loading, setLoading] = useState(false);

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

  const { data, error } = useQuery(
    ['tournamentMenus', teamId],
    fetchTournametData,
    {
      enabled: !!teamId,
      refetchOnWindowFocus: false,
    }
  );

  error && console.error(error);
  return (
    <>
      <Heading1 label="大会一覧" mb={8} />
      {data ? (
        <Stack spacing={4}>
          {data.length > 0 && <TournamentDataTable dataList={data} />}
          {data.length === 0 && (
            <Text textAlign="center">まだ大会が登録されていません。</Text>
          )}
          <LinkButton
            w="100%"
            label="追加したい大会がない場合"
            link="/tournament/create"
          />
        </Stack>
      ) : (
        <Box align="center">
          <Spinner color="gray.400" />
        </Box>
      )}
    </>
  );
};

export default TournamentFirstViewDetail;
