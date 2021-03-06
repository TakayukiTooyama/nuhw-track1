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
import React, { FC, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { db } from '../../../lib/firebase';
import { WeightMenu, WeightName } from '../../../models/users';
import { selectedDateIdState, userState } from '../../../recoil/users/user';
import {
  CountButton,
  DatePicker,
  Heading1,
  InputGroup,
  LinkButton,
} from '../../molecules';
import { WeightEditMenu } from '../../oraganisms';

const WeightEditDetail: FC = () => {
  // Global State
  const user = useRecoilValue(userState);
  const dateId = useRecoilValue(selectedDateIdState);

  // Local State
  const [menus, setMenus] = useState<WeightMenu[]>([]);
  const [name, setName] = useState('');
  const [weightNameList, setWeightNameList] = useState<WeightName[]>([]);
  const [filterNameList, setFilterNameList] = useState<WeightName[]>([]);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rm, setRm] = useState(3);

  // ページ訪問時 & 選択された日付が変わった時
  useEffect(() => {
    fetchWeightData();
    fetchTeamWeightMenu();
  }, [user, dateId]);

  // firestoreから選択された日付のデータを取ってくる処理
  const fetchWeightData = async () => {
    if (user === null) return;
    const WeightsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('weights')
      .where('dateId', '==', dateId);

    await WeightsRef.get().then((snapshot) => {
      const menusData: WeightMenu[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as WeightMenu;
        menusData.push(data);
      });
      setMenus(menusData);
    });
  };

  // チーム内のウエイトメニューを取得
  const fetchTeamWeightMenu = async () => {
    if (user === null) return;
    const teamWeithMenusRef = db
      .collection('teams')
      .doc(user.teamInfo.teamId)
      .collection('weightMenus')
      .orderBy('name', 'asc');
    await teamWeithMenusRef.get().then((snapshot) => {
      const menuList: WeightName[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as WeightName;
        menuList.push(data);
      });
      setWeightNameList(menuList);
      setFilterNameList(menuList);
    });
  };

  // メニュー追加処理
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
      rm,
      setCount: 3,
      records: [],
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

  // メニュー削除処理
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

  // メニューの名前入力処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value === '') {
      setFilterNameList(weightNameList);
    }
  };

  // 入力処理を離れる時の処理
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
        <DatePicker />
        <LinkButton label=" 終了" link={`/weight/${dateId}`} />
      </Flex>
      <Box mb={8} />

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
          <InputGroup label="RM" value={rm < 0 ? 0 : rm} isReadOnly />
          <Box mb={4} />
          <HStack spacing={2}>
            {countList.map((item) => (
              <CountButton
                key={item.label}
                setCount={setRm}
                count={rm}
                countLabel={item.count}
                label={item.label}
              />
            ))}
          </HStack>
          <Box mt={4} />
          <Input
            w="100%"
            bg="white"
            maxW="300px"
            borderRadius="none"
            placeholder="メニュー検索"
            onChange={handleChange}
            onKeyDown={searchMenu}
            onDoubleClick={handleBlur}
          />

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
                  cursor="pointer"
                >
                  <Text color="gray.400">{item.name}</Text>
                  <Divider />
                </Box>
              ))}
          </Stack>
          <Box mb={4} />

          <LinkButton
            label="追加したいメニューがない場合"
            link="/weight/createWeightMenu"
          />
        </Flex>
      ) : (
        <Button
          shadow="base"
          w="100%"
          colorScheme="blue"
          borderRadius="30px"
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
