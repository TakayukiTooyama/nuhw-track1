import { Dispatch, SetStateAction } from 'react';
import { SetterOrUpdater } from 'recoil';

import { TournamentData, TournamentMenu, User } from '../../../models/users';
import { db } from '../../firebase';

// 一年分の大会結果を取得
// eslint-disable-next-line import/prefer-default-export
export const fetchAnnualTournamentData = async (
  user: User | null,
  year: number,
  setNameList: SetterOrUpdater<string[]>,
  setMenus: Dispatch<SetStateAction<TournamentMenu[]>>
): Promise<void> => {
  if (user === null) return;
  const tournamentsRef = db
    .collection('users')
    .doc(user.uid)
    .collection('tournaments')
    .where('competitionDay', '>=', year);
  await tournamentsRef.get().then((snapshot) => {
    const menuData: TournamentMenu[] = [];
    const nameList: string[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as TournamentMenu;
      const name = data.competitionName;
      menuData.push(data);
      nameList.push(name);
    });
    const DeduplicationNameList = [...new Set(nameList)];
    setNameList(DeduplicationNameList);
    setMenus(menuData);
  });
};

// 選択している大会の日付の記録を取得
export const fetchTournamentRecord = async (
  user: User | null,
  setMenus: Dispatch<SetStateAction<TournamentMenu[]>>,
  selectedData: TournamentData
): Promise<void> => {
  if (user === null) return;
  const tournamentsRef = db
    .collection('users')
    .doc(user.uid)
    .collection('tournaments')
    .where('data.name', '==', selectedData.name);
  await tournamentsRef.get().then((snapshot) => {
    const menus: TournamentMenu[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as TournamentMenu;
      menus.push(data);
    });
    setMenus(menus);
  });
};
