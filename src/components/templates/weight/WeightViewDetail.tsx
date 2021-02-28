import { Box, Flex, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { db } from '../../../lib/firebase';
import { Comparison, Menu } from '../../../models/users';
import {
  formatTodaysDateState,
  makedMenuNameListState,
  NumberToDisplay,
  selectedDateIdState,
  selectedMakedMenuNameState,
  userState,
} from '../../../recoil/users/user';
import { Heading1, LinkButton, SelectNameList, TabList } from '../../molecules';
import { TodayData, WeightMonthlyData } from '../../oraganisms';

const WeightViewDetail: FC = () => {
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
  const [judgLastTime, setJudgLastTime] = useState(false);

  // 選択されたメニューの名前によって表示されるmenusを変えるためフィルタリング
  const filterMenus = menus.filter((menu) => menu.name === selectedName);
  // 今日
  const todayData = filterMenus.filter((menu) => menu.dateId === today);
  // 3ヶ月
  const threeMonthsData = filterMenus.filter(
    (menu) => menu.dateId >= today - 300
  );
  // 6ヶ月
  const sixMonthsData = filterMenus.filter(
    (menu) => menu.dateId >= today - 600
  );

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
    const weightsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('weights')
      .where('dateId', '>=', year);
    await weightsRef.get().then((snapshot) => {
      const menuData: Menu[] = [];
      const nameList: string[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Menu;
        const { name } = data;
        menuData.push(data);
        nameList.push(name);
      });
      const DeduplicationNameList = [...new Set(nameList)];
      const sortDeduplicationNameList = DeduplicationNameList.slice().sort();
      setNameList(sortDeduplicationNameList);
      setMenus(menuData);
    });
  };

  const LastTimeData = async () => {
    const sortMenus = menus.filter((menu) => menu.name === selectedName).sort();
    const lastIndex = sortMenus.length - 1;
    if (sortMenus.length > 0) {
      const comparisonAry1: number[] = [];
      const comparisonAry2: number[] = [];

      if (sortMenus[lastIndex]) {
        sortMenus[lastIndex].records?.forEach((record) => {
          comparisonAry1.push(Number(record.value));
        });
      }

      if (sortMenus[lastIndex - 1]) {
        sortMenus[lastIndex - 1].records?.forEach((record) => {
          comparisonAry2.push(Number(record.value));
        });
      }

      const len = comparisonAry1.length;
      const newAry: Comparison[] = [];
      for (let i = 0; i < len; i++) {
        const number = comparisonAry1[i] - comparisonAry2[i];
        const firstLetter = number.toString().slice(0, 1);
        if (firstLetter === '-') {
          newAry.push({ type: 'decrease', data: Math.abs(number) });
        } else {
          newAry.push({ type: 'increase', data: Math.abs(number) });
        }
      }
      if (!sortMenus[lastIndex - 1]) {
        setJudgLastTime(true);
        setComparisonAry(newAry);
        setLastTimeData([sortMenus[lastIndex]]);
      } else {
        setJudgLastTime(false);
        setComparisonAry(newAry);
        setLastTimeData([sortMenus[lastIndex], sortMenus[lastIndex - 1]]);
      }
    }
  };

  const format = (input: string) => `${input}kg`;

  const tabList = ['今日', '3ヶ月', '6ヶ月', '年間'];
  const tabDataList = [
    { data: threeMonthsData, dateNumber: 3 },
    { data: sixMonthsData, dateNumber: 6 },
    { data: filterMenus, dateNumber: 12 },
  ];

  return (
    <>
      <Heading1 label="ウエイト管理" />
      <Box mb={8} />
      <Flex justify="space-between" align="center">
        <SelectNameList />
        <LinkButton ml={2} label="編集" link={`/weight/edit/${dateId}`} />
      </Flex>
      <Box mb={8} />
      <Tabs variant="enclosed">
        <TabList tabList={tabList} />
        <TabPanels>
          <TabPanel p={0} pt={4}>
            <TodayData
              todayData={todayData}
              lastTimeData={lastTimeData}
              tableLabel="セット"
              graphLabel="重量"
              statLabel="set"
              format={format}
              judgLastTime={judgLastTime}
              changeNumber={changeNumber}
              setChangeNumber={setChangeNumber}
              comparisonAry={comparisonAry}
            />
          </TabPanel>
          {tabDataList.map((item, idx) => (
            <TabPanel key={idx} p={0} pt={4}>
              {item.data.length ? (
                <WeightMonthlyData
                  data={item.data}
                  dateNumber={item.dateNumber}
                  axisLabel="set"
                  label="重量"
                  format={format}
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

export default WeightViewDetail;
