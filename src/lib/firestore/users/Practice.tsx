import { Dispatch, SetStateAction } from 'react';
import { SetterOrUpdater } from 'recoil';

import { Comparison, Menu, User } from '../../../models/users';
import { db } from '../../firebase';

const usersRef = db.collection('users');

// 選択された日付の練習タイムを取得(初回は今日の日付のデータ)
export const fetchPracticeData = async (
  user: User | null,
  dateId: number,
  setMenus: Dispatch<SetStateAction<Menu[]>>
): Promise<void> => {
  if (user === null) return;

  const practicesDoc = await usersRef
    .doc(user.uid)
    .collection('practices')
    .where('dateId', '==', dateId)
    .get();

  const menusData: Menu[] = practicesDoc.docs.map((doc) => {
    const menuDoc = doc.data() as Menu;
    return {
      ...menuDoc,
    };
  });
  setMenus(menusData);
};

// 1年間の練習タイムを取得
export const fetchAnnualPracticeData = async (
  user: User | null,
  year: number,
  setMenus: Dispatch<SetStateAction<Menu[]>>,
  setNameList: SetterOrUpdater<string[]>
): Promise<void> => {
  if (user === null) return;

  const practicesRef = usersRef
    .doc(user.uid)
    .collection('practices')
    .where('dateId', '>=', year);

  await practicesRef.get().then((snapshot) => {
    const nameList: string[] = [];
    const menuData = snapshot.docs.map((doc) => {
      const data = doc.data() as Menu;
      const { name } = data;
      nameList.push(name);
      return { ...data };
    });
    setMenus(menuData);
    const DeduplicationNameList = [...new Set(nameList)];
    setNameList(DeduplicationNameList);
  });
};

// 前回の練習タイムを取得
export const fetchLastTimeData = (
  menus: Menu[],
  selectedName: string,
  setComparisonAry: Dispatch<SetStateAction<Comparison[]>>,
  setLastTimeData: Dispatch<SetStateAction<Menu[]>>
): void => {
  const sortMenus = menus.filter((menu) => menu.name === selectedName).sort();
  const lastIndex = sortMenus.length - 1;
  if (sortMenus.length) {
    const comparisonAry1: number[] = [];
    const comparisonAry2: number[] = [];

    if (sortMenus[lastIndex]) {
      sortMenus[lastIndex].records?.forEach((record) => {
        comparisonAry1.push(+record.value);
      });
    }
    if (sortMenus[lastIndex - 1]) {
      sortMenus[lastIndex - 1].records?.forEach((record) => {
        comparisonAry2.push(+record.value);
      });
    }

    const len = comparisonAry1.length;
    const newAry: Comparison[] = [];
    for (let i = 0; i < len; i += 1) {
      const number = comparisonAry1[i] - comparisonAry2[i];
      const firstLetter = String(number).slice(0, 1);
      if (firstLetter === '-') {
        newAry.push({ type: 'increase', data: Math.abs(number) });
      } else {
        newAry.push({ type: 'decrease', data: Math.abs(number) });
      }
    }
    setComparisonAry(newAry);
    setLastTimeData([sortMenus[lastIndex], sortMenus[lastIndex - 1]]);
  }
};
