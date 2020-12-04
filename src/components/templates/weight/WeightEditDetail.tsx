import React, { FC, useEffect, useState } from 'react';
import Router from 'next/router';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Menu,
  MenuItem,
  MenuList,
  Stack,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import DatePicker from '../../molecules/common/DatePicker';
import { selectedDateIdState, userAuthState } from '../../../recoil/users/user';
import { WeightMenu, WeightName } from '../../../models/users';
import { db } from '../../../lib/firebase';
import { selectedTeamInfo } from '../../../recoil/teams/team';

const WeightEditDetail: FC = () => {
  //Global State
  const user = useRecoilValue(userAuthState);
  const team = useRecoilValue(selectedTeamInfo);
  const dateId = useRecoilValue(selectedDateIdState);

  //Local State
  const [menus, setMenus] = useState<WeightMenu[]>([]),
    [name, setName] = useState(''),
    [weightNameList, setWeightNameList] = useState<WeightName[]>([]),
    [toggleMenu, setToggleMenu] = useState(false),
    [errorMessage, setErrorMessage] = useState(''),
    [rm, setRm] = useState(0);

  //ページ訪問時 & 選択された日付が変わった時
  useEffect(() => {
    fetchWeightData();
    fetchTeamWeightMenu();
  }, [user, dateId]);

  //名前入力が始まったら一度エラーメッセージをリセット
  useEffect(() => {
    setErrorMessage('');
  }, [name]);

  //firestoreから選択された日付のデータを取ってくる処理
  const fetchWeightData = async () => {
    if (user === null || user === undefined) return;
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
    //ここがまだ入っていない
    if (team === null) return;
    const teamWeithMenusRef = db
      .collection('teams')
      .doc(team.teamId)
      .collection('weights');
    console.log('hello');
    await teamWeithMenusRef.get().then((snapshot) => {
      let menuList: WeightName[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as WeightName;
        menuList.push(data);
      });
      setWeightNameList(menuList);
    });
  };

  //メニュー追加処理
  //ここ変更
  const addMenu = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (user === null || user === undefined) return;
    if (e.key === 'Enter') {
      const weightsRef = db
        .collection('users')
        .doc(user.uid)
        .collection('weights');
      const menuId = weightsRef.doc().id;
      const newData = { dateId, menuId, name, rm, recodes: [] };
      await weightsRef
        .doc(menuId)
        .set(newData)
        .then(() => {
          setMenus((prev) => [...prev, newData]);
          setToggleMenu(false);
          setName('');
        });
    }
  };

  //メニュー削除処理
  const deleteMenu = async (menuId: string) => {
    if (user === null || user === undefined) return;
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
  };

  //入力処理を離れる時の処理
  const handleBlur = () => {
    setToggleMenu(false);
    setName('');
  };

  // //検索されたウエイトメニューだけを表示させる処理
  // const searchMenu = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const update = weightNameList.filter((item) => {
  //     return (
  //       item.name.toLowerCase().search(e.target.value.toLowerCase()) !== -1
  //     );
  //   });
  //   setWeightNameList(update);
  // };

  return (
    <>
      <Heading>ウエイト管理</Heading>
      <Box mb={8}></Box>

      <Flex justify="space-between" align="center">
        <DatePicker />
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
        {/* {menus &&
          menus.map((menu) => (
            <WeightEditMenu
              key={menu.menuId}
              items={menu}
              menus={menus}
              setMenus={setMenus}
              deleteMenu={deleteMenu}
            />
          ))} */}
      </Stack>
      <Box mb={8}></Box>
      {toggleMenu ? (
        <>
          <Input
            autoFocus
            maxW="255px"
            bg="white"
            placeholder="メニュー検索"
            // onChange={searchMenu}
            onBlur={handleBlur}
          />
          <Menu isOpen>
            <MenuList isOpen>
              {weightNameList &&
                weightNameList.map((item) => (
                  <MenuItem isOpen key={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>
        </>
      ) : (
        <Button shadow="base" onClick={() => setToggleMenu(true)}>
          ウエイトメニューを追加
        </Button>
      )}
    </>
  );
};

export default WeightEditDetail;
