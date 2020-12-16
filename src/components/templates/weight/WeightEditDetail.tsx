import React, { FC, useEffect, useState } from 'react';
import Router from 'next/router';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import DatePicker from '../../molecules/common/DatePicker';
import {
  selectedDateIdState,
  userAuthState,
  userInfoState,
} from '../../../recoil/users/user';
import { WeightMenu, WeightName } from '../../../models/users';
import { db } from '../../../lib/firebase';
import { WeightEditMenu } from '../../oraganisms';

const WeightEditDetail: FC = () => {
  //Global State
  const user = useRecoilValue(userAuthState);
  const userInfo = useRecoilValue(userInfoState);
  const dateId = useRecoilValue(selectedDateIdState);

  //Local State
  const [menus, setMenus] = useState<WeightMenu[]>([]),
    [name, setName] = useState(''),
    [weightNameList, setWeightNameList] = useState<WeightName[]>([]),
    [filterNameList, setFilterNameList] = useState<WeightName[]>([]),
    [toggleMenu, setToggleMenu] = useState(false),
    [isLoading, setIsLoading] = useState(false),
    [rm, setRm] = useState(3);

  //ページ訪問時 & 選択された日付が変わった時
  useEffect(() => {
    fetchWeightData();
    fetchTeamWeightMenu();
  }, [userInfo, dateId]);

  //firestoreから選択された日付のデータを取ってくる処理
  const fetchWeightData = async () => {
    if (user === null) return;
    if (userInfo === null) return;
    const WeightsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('weights')
      .where('dateId', '==', dateId);

    await WeightsRef.get().then((snapshot) => {
      let menusData: WeightMenu[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as WeightMenu;
        menusData.push(data);
      });
      setMenus(menusData);
    });
  };

  //チーム内のウエイトメニューを取得
  const fetchTeamWeightMenu = async () => {
    if (userInfo === null) return;
    const teamWeithMenusRef = db
      .collection('teams')
      .doc(userInfo.teamInfo.teamId)
      .collection('weightMenus');
    await teamWeithMenusRef.get().then((snapshot) => {
      let menuList: WeightName[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as WeightName;
        menuList.push(data);
      });
      setWeightNameList(menuList);
      setFilterNameList(menuList);
    });
  };

  //メニュー追加処理
  const addMenu = async (selectedName: string) => {
    if (user === null) return;
    setIsLoading(true);
    setToggleMenu(false);
    const weightsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('weights');
    const menuId = weightsRef.doc().id;
    const newData = {
      dateId,
      menuId,
      name: selectedName,
      rm: rm,
      setCount: 3,
      recodes: [],
    };
    await weightsRef
      .doc(menuId)
      .set(newData)
      .then(() => {
        setMenus((prev) => [...prev, newData]);
        setName('');
        setIsLoading(false);
      });
  };

  //メニュー削除処理
  const deleteMenu = async (menuId: string) => {
    if (user === null) return;
    const weightsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('weights')
      .doc(menuId);
    await weightsRef.delete().then(() => {
      const newMenus = menus.filter((menu) => menu.menuId !== menuId);
      setMenus(newMenus);
    });
  };

  //メニューの名前入力処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value === '') {
      setFilterNameList(weightNameList);
    }
  };

  //入力処理を離れる時の処理
  const handleBlur = () => {
    setToggleMenu(false);
    setName('');
  };

  /*
    検索されたウエイトメニューだけを表示させる処理
    本当は入力したタイミングで変更したいが全角だと上手くいかないため
    Enterクリック時にしている
  */
  const searchMenu = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      const update = weightNameList.filter(
        (item) => item.name.indexOf(name) !== -1
      );
      setFilterNameList(update);
    }
  };

  return (
    <>
      <Heading>ウエイト管理</Heading>
      <Box mb={8}></Box>

      <Flex justify="space-between" align="center">
        <DatePicker bg="blue.400" />
        <Button
          size="sm"
          shadow="base"
          onClick={() => Router.push(`/weight/${dateId}`)}
        >
          終了
        </Button>
      </Flex>
      <Box mb={8}></Box>

      <Stack spacing={4}>
        {menus &&
          menus.map((menu) => (
            <WeightEditMenu
              key={menu.menuId}
              items={menu}
              setMenus={setMenus}
              deleteMenu={deleteMenu}
            />
          ))}
      </Stack>
      <Box mb={8}></Box>
      {toggleMenu ? (
        <Box w="100%">
          <Stack>
            <InputGroup bg="white" borderRadius="5px" w="70%">
              <Input value={rm} readOnly={true} textAlign="center" />
              <InputRightElement children="RM" />
            </InputGroup>
            <HStack spacing={1}>
              <Button shadow="base" onClick={() => setRm((prev) => prev + 10)}>
                10RM
              </Button>
              <Button shadow="base" onClick={() => setRm((prev) => prev + 1)}>
                ＋1
              </Button>
              <Button shadow="base" onClick={() => setRm((prev) => prev - 1)}>
                −1
              </Button>
            </HStack>
          </Stack>
          <Box mt={4}>
            <Input
              w="70%"
              bg="white"
              placeholder="メニュー検索"
              onChange={handleChange}
              onKeyDown={searchMenu}
              onDoubleClick={handleBlur}
            />
            <Box mb={1}></Box>
            <Stack
              w="70%"
              maxW="300px"
              border="1px solid"
              borderColor="gray.200"
              spacing={0}
            >
              {filterNameList &&
                filterNameList.map((item) => (
                  <Box
                    key={item.id}
                    bg="white"
                    textAlign="center"
                    h="35px"
                    lineHeight="35px"
                    _hover={{ bg: 'gray.100' }}
                    onClick={() => addMenu(item.name)}
                  >
                    <Text color="gray.400">{item.name}</Text>
                    <Divider />
                  </Box>
                ))}
            </Stack>
            <Button
              shadow="base"
              color="gray.400"
              onClick={() => Router.push('/weight/createWeightMenu')}
            >
              追加したいメニューがない場合
            </Button>
          </Box>
        </Box>
      ) : (
        <Button
          shadow="base"
          onClick={() => setToggleMenu(true)}
          isLoading={isLoading}
        >
          ウエイトメニューを追加
        </Button>
      )}
    </>
  );
};

export default WeightEditDetail;
