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
  PinInput,
  PinInputField,
  StatGroup,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import Router from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { db } from '../../../lib/firebase';
import { Menu } from '../../../models/users';
import {
  formatTodaysDateState,
  makedMenuNameListState,
  NumberToDisplay,
  selectedDateIdState,
  selectedMakedMenuNameState,
  userAuthState,
} from '../../../recoil/users/user';
import { Stat } from '../../molecules';
import {
  GraphAllData,
  GraphDailyAverage,
  GraphMonthlyAverage,
  TableView,
} from '../../oraganisms';

type Comparison = {
  type: 'increase' | 'decrease';
  data: number;
};

const WeightViewDetail: FC = () => {
  const user = useRecoilValue(userAuthState);
  const dateId = useRecoilValue(selectedDateIdState);
  const today = useRecoilValue(formatTodaysDateState);
  const year = today - 10000;
  const [selectedName, setSelectedName] = useRecoilState(
    selectedMakedMenuNameState
  );
  const [nameList, setNameList] = useRecoilState(makedMenuNameListState);
  const [displayNumber, setDisplayNumber] = useRecoilState(NumberToDisplay);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [changeNumber, setChangeNumber] = useState(displayNumber);
  const [lastTime, setLastTime] = useState<Menu[]>([]);
  const [comparisonAry, setComparisonAry] = useState<Comparison[]>([]);
  const [judgLastTime, setJudgLastTime] = useState(false);

  //選択されたメニューの名前によって表示されるmenusを変えるためフィルタリング
  const filterMenus = menus.filter((menu) => menu.name === selectedName);
  //今日
  const todaysData = filterMenus.filter((menu) => menu.dateId === today);
  //1ヶ月
  // const oneMonthData = filterMenus.filter((menu) => menu.dateId >= today - 100);
  //3ヶ月
  const threeMonthsData = filterMenus.filter(
    (menu) => menu.dateId >= today - 300
  );
  //6ヶ月
  const sixMonthsData = filterMenus.filter(
    (menu) => menu.dateId >= today - 600
  );
  //ソートしたメニューの名前リスト
  const sortNameList = nameList.slice().sort();

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
      let menuData: Menu[] = [];
      let nameList: string[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Menu;
        const name = data.name;
        menuData.push(data);
        nameList.push(name);
      });
      const DeduplicationNameList = [...new Set(nameList)];
      setNameList(DeduplicationNameList);
      setMenus(menuData);
    });
  };

  const LastTimeData = async () => {
    const sortMenus = menus.filter((menu) => menu.name === selectedName).sort();
    const lastIndex = sortMenus.length - 1;
    if (sortMenus.length > 0) {
      let comparisonAry1: number[] = [];
      let comparisonAry2: number[] = [];

      if (sortMenus[lastIndex]) {
        sortMenus[lastIndex].recodes.forEach((recode) => {
          comparisonAry1.push(Number(recode.value));
        });
      }

      if (sortMenus[lastIndex - 1]) {
        sortMenus[lastIndex - 1].recodes.forEach((recode) => {
          comparisonAry2.push(Number(recode.value));
        });
      }

      const len = comparisonAry1.length;
      const newAry: Comparison[] = [];
      for (let i = 0; i < len; i++) {
        const number = comparisonAry1[i] - comparisonAry2[i];
        const firstLetter = number.toString().slice(0, 1);
        if (firstLetter === '-') {
          newAry.push({ type: 'increase', data: Math.abs(number) });
        } else {
          newAry.push({ type: 'decrease', data: Math.abs(number) });
        }
      }
      if (!sortMenus[lastIndex - 1]) {
        setJudgLastTime(true);
        setComparisonAry(newAry);
        setLastTime([sortMenus[lastIndex]]);
      } else {
        setComparisonAry(newAry);
        setLastTime([sortMenus[lastIndex], sortMenus[lastIndex - 1]]);
      }
    } else {
      return;
    }
  };

  const handleChange = (value: string) => {
    setChangeNumber(value);
  };

  const format = (input: string) => {
    return `${input}kg`;
  };

  return (
    <>
      <Heading>ウエイト管理</Heading>
      <Box mb={8}></Box>
      <Flex justify="space-between" align="center">
        <StyleMenu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} shadow="base">
            {selectedName}
          </MenuButton>
          <MenuList>
            {nameList.length > 0 &&
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
          onClick={() => Router.push(`/weight/edit/${dateId}`)}
        >
          編集
        </Button>
      </Flex>
      <Box mb={8}></Box>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>今日</Tab>
          <Tab>3ヶ月</Tab>
          <Tab>6ヶ月</Tab>
          <Tab>年間</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            {todaysData.length > 0 && lastTime.length > 0 ? (
              <>
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md">今回と前回の記録</Heading>
                  <PinInput value={changeNumber} onChange={handleChange}>
                    <PinInputField />
                  </PinInput>
                </Flex>
                <TableView
                  menus={judgLastTime ? todaysData : lastTime}
                  label="セット目"
                  format={format}
                />
                <Box mb={12}></Box>
                <Heading size="md" mb={4}>
                  前回比較
                </Heading>
                <StatGroup ml={6}>
                  {judgLastTime ? (
                    <Text>前回の記録がありません</Text>
                  ) : (
                    comparisonAry.map((item, idx) => (
                      <Stat
                        key={idx.toString()}
                        type={item.type}
                        data={item.data}
                        label="set"
                        idx={idx}
                        format={format}
                      />
                    ))
                  )}
                </StatGroup>
                <Box mb={12}></Box>
                <Heading size="md" mb={4}>
                  記録遷移グラフ
                </Heading>
                <GraphAllData data={todaysData} label="重量" axisLabel="set" />
              </>
            ) : (
              <Text>まだ登録されていません</Text>
            )}
          </TabPanel>
          <TabPanel p={0}>
            {threeMonthsData.length > 0 ? (
              <>
                <GraphAllData
                  data={threeMonthsData}
                  label="重量"
                  axisLabel="set"
                />
                <GraphDailyAverage data={threeMonthsData} label="重量" />
                <TableView
                  menus={threeMonthsData}
                  label="セット目"
                  format={format}
                />
              </>
            ) : (
              <Text>まだ登録されていません</Text>
            )}
          </TabPanel>
          <TabPanel p={0}>
            {sixMonthsData.length > 0 ? (
              <>
                <GraphAllData
                  data={sixMonthsData}
                  label="重量"
                  axisLabel="set"
                />
                <GraphDailyAverage data={sixMonthsData} label="重量" />
                <TableView
                  menus={sixMonthsData}
                  label="セット目"
                  format={format}
                />
              </>
            ) : (
              <Text>まだ登録されていません</Text>
            )}
          </TabPanel>
          <TabPanel p={0}>
            {filterMenus.length > 0 ? (
              <>
                <GraphAllData data={filterMenus} label="重量" axisLabel="set" />
                <GraphDailyAverage data={filterMenus} label="重量" />
                <GraphMonthlyAverage data={filterMenus} label="平均重量" />
                <TableView
                  menus={filterMenus}
                  label="セット目"
                  format={format}
                />
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

export default WeightViewDetail;
