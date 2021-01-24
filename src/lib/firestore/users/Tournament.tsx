import { Dispatch, SetStateAction } from 'react';
import { SetterOrUpdater } from 'recoil';

import { TournamentMenu, User } from '../../../models/users';
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
