import React, { FC, useEffect, useState } from 'react';

import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { selectedDateIdState, userState } from '../../../recoil/users/user';
import { WeightMenu, WeightName } from '../../../models/users';
import { db } from '../../../lib/firebase';
import { WeightEditMenu } from '../../oraganisms';
import {
  CountButton,
  DatePicker,
  Heading1,
  InputGroup,
  LinkButton,
} from '../../molecules';

const WeightEditDetail: FC = () => {
  //Global State
  const user = useRecoilValue(userState);
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
  }, [user, dateId]);

  //firestoreから選択された日付のデータを取ってくる処理
  const fetchWeightData = async () => {
    if (user === null) return;
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
    if (user === null) return;
    const teamWeithMenusRef = db
      .collection('teams')
      .doc(user.teamInfo.teamId)
      .collection('weightMenus')
      .orderBy('name', 'asc');
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

  const countList = [
    { count: 10, label: '10RM' },
    { count: 1, label: '+ 1' },
    { count: -1, label: '− 1' },
  ];

  return (
    <>
      <Heading1 label="ウエイト管理" />
      <Box mb={8} />

      <Flex justify="space-between" align="center">
        <DatePicker bg="blue.400" />
        <LinkButton label=" 終了" link={`/weight/${dateId}`} />
      </Flex>

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
      <Box mb={8} />

      {toggleMenu ? (
        <Flex justify="center" direction="column" align="center">
          <InputGroup label="RM" value={rm} isReadOnly={true} />
          <Box mb={1} />
          <HStack spacing={1}>
            {countList.map((item) => (
              <CountButton
                key={item.label}
                setCount={setRm}
                count={item.count}
                label={item.label}
              />
            ))}
          </HStack>
          <Box mt={4} />
          <Input
            w="100%"
            bg="white"
            maxW="300px"
            placeholder="メニュー検索"
            onChange={handleChange}
            onKeyDown={searchMenu}
            onDoubleClick={handleBlur}
          />
          <Box mb={1} />

          <Stack
            w="100%"
            maxW="300px"
            border="1px solid"
            borderColor="gray.200"
            spacing={0}
          >
            {filterNameList &&
              filterNameList.map((item) => (
                <Box
                  key={item.id}
                  px={2}
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
          <Box mb={4} />

          <LinkButton
            label="追加したいメニューがない場合"
            link={'/weight/createWeightMenu'}
          />
        </Flex>
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
