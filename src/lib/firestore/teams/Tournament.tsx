import { Dispatch, SetStateAction } from 'react';

import { TournamentData, User } from '../../../models/users';
import { db } from '../../firebase';

const teamsRef = db.collection('teams');

// 大会のメニューを取得(上から大会開催日が近い順に)
export const fetchTournamentMenu = async (
  user: User | null,
  setMenus: Dispatch<SetStateAction<TournamentData[]>>
): Promise<void> => {
  if (user === null) return;

  const tournamentsRef = teamsRef
    .doc(user.teamInfo.teamId)
    .collection('tournamentMenus')
    .orderBy('startDate', 'desc');

  await tournamentsRef.get().then((snapshot) => {
    const tournamentMenus: TournamentData[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as TournamentData;
      tournamentMenus.push(data);
    });
    setMenus(tournamentMenus);
  });
};

// 出場した大会を取得
export const fetchTournamentData = async (
  user: User | null,
  setDataList: Dispatch<SetStateAction<TournamentData[]>>
): Promise<void> => {
  if (user === null) return;
  if (!user.tournamentIds) return;
  const tournamentMenusRef = db
    .collection('teams')
    .doc(user.teamInfo.teamId)
    .collection('tournamentMenus');
  await tournamentMenusRef.get().then((snapshot) => {
    const dataList: TournamentData[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as TournamentData;
      user.tournamentIds.forEach((id) => {
        if (id === data.id) {
          dataList.push(data);
        }
      });
    });
    setDataList(dataList);
  });
};
