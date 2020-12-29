import {
  Box,
  Flex,
  Heading,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState, VFC } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { insertStr } from '../../../hooks/useInsertStr';

import { db } from '../../../lib/firebase';
import { Menu } from '../../../models/users';
import {
  formatTodaysDateState,
  makedMenuNameListState,
  NumberToDisplay,
  selectedDateIdState,
  selectedMakedMenuNameState,
  userState,
} from '../../../recoil/users/user';
import { LinkButton, SelectNameList, TabList } from '../../molecules';
import { PracticeTodayData, PracticeMonthlyData } from '../../oraganisms';

export type Comparison = {
  type: 'increase' | 'decrease';
  data: number;
};

const PracticeViewDetail: VFC = () => {
  const user = useRecoilValue(userState);
  const dateId = useRecoilValue(selectedDateIdState);
  const today = useRecoilValue(formatTodaysDateState);
  const year = today - 10000;
  const [selectedName, setSelectedName] = useRecoilState(
    selectedMakedMenuNameState
  );
  const setNameList = useSetRecoilState(makedMenuNameListState);
  const [displayNumber, setDisplayNumber] = useRecoilState(NumberToDisplay);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [changeNumber, setChangeNumber] = useState(displayNumber);
  const [lastTimeData, setLastTimeData] = useState<Menu[]>([]);
  const [comparisonAry, setComparisonAry] = useState<Comparison[]>([]);

  //選択されたメニューの名前によって表示されるmenusを変えるためフィルタリング
  const filterMenus = menus.filter((menu) => menu.name === selectedName);
  //今日
  const todaysData = filterMenus.filter((menu) => menu.dateId === today);
  //3ヶ月
  const threeMonthsData = filterMenus.filter(
    (menu) => menu.dateId >= today - 300
  );
  //6ヶ月
  const sixMonthsData = filterMenus.filter(
    (menu) => menu.dateId >= today - 600
  );
  //タブメニュー
  const tabList = ['今日', '3ヶ月', '6ヶ月', '年間'];

  useEffect(() => {
    fetchAnnualData();
    setSelectedName('選択してください');
  }, [user]);

  useEffect(() => {
    if (changeNumber === '') return;
    setDisplayNumber(changeNumber);
  }, [changeNumber]);

  useEffect(() => {
    LastTimeData();
  }, [selectedName]);

  const fetchAnnualData = async () => {
    if (user === null) return;
    const practicesRef = db
      .collection('users')
      .doc(user.uid)
      .collection('practices')
      .where('dateId', '>=', year);
    await practicesRef.get().then((snapshot) => {
      let nameList: string[] = [];
      const menuData = snapshot.docs.map((doc) => {
        const data = doc.data() as Menu;
        const name = data.name;
        nameList.push(name);
        return { ...data };
      });
      setMenus(menuData);
      const DeduplicationNameList = [...new Set(nameList)];
      setNameList(DeduplicationNameList);
    });
  };

  const LastTimeData = async () => {
    const sortMenus = menus.filter((menu) => menu.name === selectedName).sort();
    const lastIndex = sortMenus.length - 1;
    if (sortMenus.length) {
      let comparisonAry1: number[] = [];
      let comparisonAry2: number[] = [];

      if (sortMenus[lastIndex]) {
        sortMenus[lastIndex].recodes.forEach((recode) => {
          comparisonAry1.push(+recode.value);
        });
      }
      if (sortMenus[lastIndex - 1]) {
        sortMenus[lastIndex - 1].recodes.forEach((recode) => {
          comparisonAry2.push(+recode.value);
        });
      }

      const len = comparisonAry1.length;
      const newAry: Comparison[] = [];
      for (let i = 0; i < len; i++) {
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
    } else {
      return;
    }
  };
  const tabDataList = [
    {
      dateNumber: 3,
      data: threeMonthsData,
    },
    { dateNumber: 6, data: sixMonthsData },
    { dateNumber: 12, data: filterMenus },
  ];

  return (
    <>
      <Heading>練習タイム</Heading>
      <Box mb={8} />

      <Flex justify="space-between" align="center">
        <SelectNameList />
        <LinkButton label="編集" link={`/practice/edit/${dateId}`} />
      </Flex>
      <Box mb={8} />

      <Tabs variant="enclosed">
        <TabList tabList={tabList} />
        <TabPanels>
          <TabPanel p={0} pt={4}>
            {todaysData.length && lastTimeData.length ? (
              <PracticeTodayData
                data={todaysData}
                lastTimeData={lastTimeData}
                setChangeNumber={setChangeNumber}
                changeNumber={changeNumber}
                comparisonAry={comparisonAry}
              />
            ) : (
              <Text pl={4}>まだ登録されていません</Text>
            )}
          </TabPanel>
          {tabDataList.map((item, idx) => (
            <TabPanel key={idx} p={0} pt={4}>
              {item.data.length ? (
                <PracticeMonthlyData
                  data={item.data}
                  dateNumber={item.dateNumber}
                  axisLabel="本目"
                  label="タイム"
                  format={insertStr}
                />
              ) : (
                <Text pl={4}>まだ登録されていません</Text>
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default PracticeViewDetail;
