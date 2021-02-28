import { Box, Flex, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { fetchTournamentData } from '../../../lib/firestore/teams';
import { fetchAnnualTournamentData } from '../../../lib/firestore/users';
import {
  TournamentData,
  TournamentMenu,
  TournamentRecord,
} from '../../../models/users';
import {
  makedMenuNameListState,
  selectedMakedMenuNameState,
  selectedTournamentDataState,
  userState,
} from '../../../recoil/users/user';
import { LinkButton, SelectNameList, TabList } from '../../molecules';
import {
  TournamentHeader,
  TournamentTodayData,
  TournamentYearData,
} from '../../oraganisms';
import { CalcWind100m, CalcWind200m } from './WindConverting';

// 入力された文字列をタイム表記に変換
export const timeNotation = (input: string) =>
  `${input.slice(0, 2)}.${input.slice(2, 4)}`;
export const undo = (returnNumber: number) => {
  let convertStr = String(returnNumber);
  const len = convertStr.length;
  if (convertStr.slice(-2, -1) === '.') {
    convertStr = String(returnNumber.toFixed(2));
    return convertStr.slice(0, len - 2) + convertStr.slice(-2);
  }
  return convertStr.slice(0, len - 3) + convertStr.slice(len - 2, len);
};

const TournamentViewDetail: FC = () => {
  // Global State
  const user = useRecoilValue(userState);
  const setNameList = useSetRecoilState(makedMenuNameListState);
  const [selectedName, setSelectedName] = useRecoilState(
    selectedMakedMenuNameState
  );
  const selectedData = useRecoilValue(selectedTournamentDataState);

  // Local State
  const [toggleNoWind, setToggleNoWind] = useState(false);
  const [windLessMenus, setWindLessMenus] = useState<TournamentMenu[]>([]);
  const [menus, setMenus] = useState<TournamentMenu[]>([]);
  const [dataList, setDataList] = useState<TournamentData[]>([]);

  const format = (date: Date | string, format: string) =>
    moment(date).format(format);

  // 今日の日付(2020年12月1日 → 20201201)
  const today = Number(format(new Date(), 'YYYYMMDD'));
  // 一年前
  const year = today - 10000;

  useEffect(() => {
    fetchAnnualTournamentData(user, year, setNameList, setMenus);
    fetchTournamentData(user, setDataList);
  }, [user, fetchAnnualTournamentData]);

  // ページ遷移時選択している種目をリセット
  useEffect(() => {
    setSelectedName('選択してください');
  }, []);

  // 選択された種目と大会名によって表示を変える
  const filterMenus1 =
    menus &&
    menus.filter(
      (menu) =>
        menu.competitionName === selectedName &&
        menu.data.name === selectedData.name
    );

  // 選択された種目によって表示を変える
  const filterMenus2 =
    menus && menus.filter((menu) => menu.competitionName === selectedName);

  const windlessCalculation = (
    name: '100M' | '200M',
    menus: TournamentMenu[]
  ) => {
    setToggleNoWind(true);
    if (name === '100M') {
      const menus100m: TournamentMenu[] = menus.map((menu) => {
        const records: TournamentRecord[] = menu.records.map((record) => ({
          ...record,
          value: String(
            undo(
              CalcWind100m(
                Number(timeNotation(record.value)),
                Number(record.wind)
              )
            )
          ),
          wind: '0.0',
        }));
        return {
          ...menu,
          records,
        };
      });
      setWindLessMenus(menus100m);
    } else {
      const menus200m = menus.map((menu) => {
        const records: TournamentRecord[] = menu.records.map((record) => ({
          ...record,
          value: String(
            undo(
              CalcWind200m(
                Number(timeNotation(record.value)),
                Number(record.wind),
                Number(record.lane)
              )
            )
          ),
          wind: '0.0',
        }));
        return {
          ...menu,
          records,
        };
      });
      setWindLessMenus(menus200m);
    }
  };

  const tabList = ['今日', '年間'];

  return (
    <>
      <TournamentHeader dataList={dataList} />
      <Box mb={4} />

      <Flex justify="space-between" align="center">
        <SelectNameList />
        <LinkButton label="編集" link="/tournament/edit" ml={2} />
      </Flex>
      <Box mb={8} />

      <Tabs variant="enclosed">
        <TabList tabList={tabList} />
        <TabPanels>
          <TabPanel p={0} pt={4}>
            {filterMenus1.length ? (
              <TournamentTodayData
                windlessCalculation={windlessCalculation}
                windLessMenus={windLessMenus}
                filterMenus={filterMenus1}
                toggleNoWind={toggleNoWind}
                setToggleNoWind={setToggleNoWind}
              />
            ) : (
              <Text>まだ登録されていません</Text>
            )}
          </TabPanel>
          <TabPanel p={0} pt={4}>
            {filterMenus1.length ? (
              <TournamentYearData
                windlessCalculation={windlessCalculation}
                windLessMenus={windLessMenus}
                filterMenus1={filterMenus1}
                filterMenus2={filterMenus2}
                toggleNoWind={toggleNoWind}
                setToggleNoWind={setToggleNoWind}
              />
            ) : (
              <Text>まだ登録されていません</Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default TournamentViewDetail;
