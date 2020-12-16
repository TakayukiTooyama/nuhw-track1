import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  Menu as StyleMenu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import moment from 'moment';
import Router from 'next/router';

import { TournamentRecode } from '../../../models/users';
import { selectedMakedMenuNameState } from '../../../recoil/users/user';
import GraphAllData from '../../oraganisms/tournament/GraphAllData';
import TableView from '../../oraganisms/tournament/TableView';
import { CalcWind200m, CalcWind100m } from './test';
import { TournamentData, TournamentMenu } from '../../../models/users';
import {
  selectedTournamentDataState,
  userAuthState,
  makedMenuNameListState,
  userInfoState,
} from '../../../recoil/users/user';
import { db } from '../../../lib/firebase';
import { TournamentHeader } from '../../oraganisms';

//入力された文字列をタイム表記に変換
export const timeNotation = (input: string) => {
  return input.slice(0, 2) + '.' + input.slice(2, 4);
};
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
  //Global State
  const user = useRecoilValue(userAuthState);
  const userInfo = useRecoilValue(userInfoState);
  const setNameList = useSetRecoilState(makedMenuNameListState);
  const [selectedName, setSelectedName] = useRecoilState(
    selectedMakedMenuNameState
  );
  const nameList = useRecoilValue(makedMenuNameListState);
  const selectedData = useRecoilValue(selectedTournamentDataState);

  //Local State
  const [hide, setHide] = useState(false);
  const [toggleNoWind, setToggleNoWind] = useState(false);
  const [windLessMenus, setWindLessMenus] = useState<TournamentMenu[]>([]);
  const [menus, setMenus] = useState<TournamentMenu[]>([]);
  const [dataList, setDataList] = useState<TournamentData[]>([]);

  const format = (date: Date | string, format: string) => {
    return moment(date).format(format);
  };

  //今日の日付(2020年12月1日 → 20201201)
  const today = Number(format(new Date(), 'YYYYMMDD'));
  //一年前
  const year = today - 10000;

  useEffect(() => {
    fetchYearData();
    fetchTournamentData();
  }, [userInfo]);

  //一年分の大会結果を取得
  const fetchYearData = async () => {
    if (user === null) return;
    const tournamentsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('tournaments')
      .where('competitionDay', '>=', year);
    await tournamentsRef.get().then((snapshot) => {
      let menuData: TournamentMenu[] = [];
      let nameList: string[] = [];
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

  //出場した大会を取得
  const fetchTournamentData = async () => {
    if (userInfo === null) return;
    const tournamentMenusRef = db
      .collection('teams')
      .doc(userInfo.teamInfo.teamId)
      .collection('tournamentMenus');
    await tournamentMenusRef.get().then((snapshot) => {
      const dataList: TournamentData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as TournamentData;
        userInfo.tournamentIds.map((id) => {
          if (id === data.id) {
            dataList.push(data);
          }
        });
      });
      setDataList(dataList);
    });
  };

  //ページ遷移時選択している種目をリセット
  useEffect(() => {
    setSelectedName('選択してください');
  }, []);

  //選択された種目と大会名によって表示を変える
  const filterMenus1 =
    menus &&
    menus.filter(
      (menu) =>
        menu.competitionName === selectedName &&
        menu.data.name === selectedData.name
    );

  //選択された種目によって表示を変える
  const filterMenus2 =
    menus && menus.filter((menu) => menu.competitionName === selectedName);

  //ソートしたメニューの名前リスト
  const sortNameList = nameList.slice().sort();

  const restore = () => {
    setToggleNoWind(false);
  };

  const windlessCalculation = (
    name: '100M' | '200M',
    menus: TournamentMenu[]
  ) => {
    setToggleNoWind(true);
    if (name === '100M') {
      const menus100m: TournamentMenu[] = menus.map((menu) => {
        const recodes: TournamentRecode[] = menu.recodes.map((recode) => {
          return {
            ...recode,
            value: String(
              undo(
                CalcWind100m(
                  Number(timeNotation(recode.value)),
                  Number(recode.wind)
                )
              )
            ),
            wind: '0.0',
          };
        });
        return {
          ...menu,
          recodes,
        };
      });
      setWindLessMenus(menus100m);
    } else {
      const menus200m = menus.map((menu) => {
        const recodes: TournamentRecode[] = menu.recodes.map((recode) => {
          return {
            ...recode,
            value: String(
              undo(
                CalcWind200m(
                  Number(timeNotation(recode.value)),
                  Number(recode.wind),
                  Number(recode.lane)
                )
              )
            ),
            wind: '0.0',
          };
        });
        return {
          ...menu,
          recodes,
        };
      });
      setWindLessMenus(menus200m);
    }
  };

  return (
    <>
      <TournamentHeader dataList={dataList} />
      <Flex justify="space-between" align="center">
        <StyleMenu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} shadow="base">
            {selectedName}
          </MenuButton>
          <MenuList>
            {nameList &&
              nameList.length &&
              sortNameList.map((item) => (
                <MenuItem key={item} onClick={() => setSelectedName(item)}>
                  {item}
                </MenuItem>
              ))}
          </MenuList>
        </StyleMenu>
        <Button
          shadow="base"
          size="sm"
          onClick={() => Router.push('/tournament/edit')}
        >
          編集
        </Button>
      </Flex>
      <Box mb={8}></Box>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>今日</Tab>
          <Tab>年間</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            {filterMenus1.length ? (
              <>
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md">今回と前回の結果</Heading>
                  {selectedName === '100M' || selectedName === '200M' ? (
                    toggleNoWind ? (
                      <Button shadow="base" onClick={() => restore()}>
                        元に戻す
                      </Button>
                    ) : (
                      <Button
                        shadow="base"
                        onClick={() =>
                          windlessCalculation(selectedName, filterMenus1)
                        }
                      >
                        無風計算
                      </Button>
                    )
                  ) : null}
                  {hide ? (
                    <Button shadow="base" onClick={() => setHide(false)}>
                      大会名を表示
                    </Button>
                  ) : (
                    <Button shadow="base" onClick={() => setHide(true)}>
                      大会名を非表示
                    </Button>
                  )}
                </Flex>
                <TableView
                  menus={toggleNoWind ? windLessMenus : filterMenus1}
                  hide={hide}
                />
                <Box mb={12}></Box>

                <Heading size="md" mb={4}>
                  記録遷移グラフ
                </Heading>
                <GraphAllData data={filterMenus1} label="記録" />
              </>
            ) : (
              <Text>まだ登録されていません</Text>
            )}
          </TabPanel>
          <TabPanel p={0}>
            {filterMenus1.length ? (
              <>
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md">今回と前回の結果</Heading>
                  {selectedName === '100M' || selectedName === '200M' ? (
                    toggleNoWind ? (
                      <Button shadow="base" onClick={() => restore()}>
                        元に戻す
                      </Button>
                    ) : (
                      <Button
                        shadow="base"
                        onClick={() =>
                          windlessCalculation(selectedName, filterMenus1)
                        }
                      >
                        無風計算
                      </Button>
                    )
                  ) : null}
                  {hide ? (
                    <Button shadow="base" onClick={() => setHide(false)}>
                      大会名を表示
                    </Button>
                  ) : (
                    <Button shadow="base" onClick={() => setHide(true)}>
                      大会名を非表示
                    </Button>
                  )}
                </Flex>
                <TableView
                  menus={toggleNoWind ? windLessMenus : filterMenus2}
                  hide={hide}
                />
                <Box mb={12}></Box>

                <Heading size="md" mb={4}>
                  記録遷移グラフ
                </Heading>
                <GraphAllData data={filterMenus2} label="記録" />
              </>
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
