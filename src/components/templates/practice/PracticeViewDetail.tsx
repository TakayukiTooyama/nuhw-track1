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

import {
  fetchAnnualPracticeData,
  fetchLastTimeData,
} from '../../../lib/firestore/users';
import { Menu } from '../../../models/users';
import {
  formatTodaysDateState,
  makedMenuNameListState,
  NumberToDisplay,
  selectedDateIdState,
  selectedMakedMenuNameState,
  userState,
} from '../../../recoil/users/user';
import { formatTimeNotationAtInput } from '../../../utils/formatTimeNotationAtInput';
import { LinkButton, SelectNameList, TabList } from '../../molecules';
import { PracticeMonthlyData, PracticeTodayData } from '../../oraganisms';

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

  // 選択されたメニューの名前によって表示されるmenusを変えるためフィルタリング
  const filterMenus = menus.filter((menu) => menu.name === selectedName);
  // 今日
  const todaysData = filterMenus.filter((menu) => menu.dateId === today);
  // 3ヶ月
  const threeMonthsData = filterMenus.filter(
    (menu) => menu.dateId >= today - 300
  );
  // 6ヶ月
  const sixMonthsData = filterMenus.filter(
    (menu) => menu.dateId >= today - 600
  );
  // タブメニュー
  const tabList = ['今日', '3ヶ月', '6ヶ月', '年間'];

  // 初回
  useEffect(() => {
    fetchAnnualPracticeData(user, year, setMenus, setNameList);
    setSelectedName('選択してください');
  }, [user, year, setNameList, setSelectedName]);

  // 初回
  useEffect(() => {
    fetchLastTimeData(menus, selectedName, setComparisonAry, setLastTimeData);
  }, [selectedName, menus]);

  // 練習タイムの表示数を変更した時
  useEffect(() => {
    if (changeNumber === '') return;
    setDisplayNumber(changeNumber);
  }, [changeNumber, setDisplayNumber]);

  /*
    dateNumber: 3 → 3ヶ月
    data: threeMonthsData → 3ヶ月分の練習タイムのデータ
   */
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
        <Box mr={4} />
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
          {tabDataList.map((item) => (
            <TabPanel key={`${item.dateNumber}`} p={0} pt={4}>
              {item.data.length ? (
                <PracticeMonthlyData
                  data={item.data}
                  dateNumber={item.dateNumber}
                  axisLabel="本目"
                  label="タイム"
                  format={formatTimeNotationAtInput}
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
