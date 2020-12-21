import { Box } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { db } from '../../../lib/firebase';
import { TournamentData } from '../../../models/users';
import { userInfoState } from '../../../recoil/users/user';
import { TournamentDataTable } from '../../oraganisms';
import { Heading1, LinkButton } from '../../molecules';

const TournamentFirstViewDetail: FC = () => {
  //Global State
  const user = useRecoilValue(userInfoState);

  //Local State
  const [dataList, setDataList] = useState<TournamentData[]>([]);

  //ページ訪問時 & 選択された日付が変わった時
  useEffect(() => {
    if (dataList.length > 0) return;
    fetchTournametData();
  }, [user]);

  //team内で登録されている大会の情報を取得
  const fetchTournametData = async () => {
    if (user === null) return;
    const tournamentMenusRef = db
      .collection('teams')
      .doc(user.teamInfo.teamId)
      .collection('tournamentMenus');
    await tournamentMenusRef.get().then((snapshot) => {
      let tournamentDataList: TournamentData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as TournamentData;
        tournamentDataList.push(data);
      });
      setDataList(tournamentDataList);
    });
  };

  return (
    <>
      <Heading1 label="大会一覧" />
      <Box mb={8} />
      <TournamentDataTable dataList={dataList} />
      <Box mb={4} />
      <LinkButton
        label="追加したい大会がない場合"
        link={'/tournament/create'}
      />
    </>
  );
};

export default TournamentFirstViewDetail;
