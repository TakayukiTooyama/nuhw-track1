import React, { FC, useEffect, useState } from 'react';
import Router from 'next/router';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';

import DatePicker from '../../molecules/common/DatePicker';
import {
  isComposedState,
  selectedDateIdState,
  userAuthState,
} from '../../../recoil/users/user';
import { Menu } from '../../../models/users';
import { PracticeEditMenu } from '../../oraganisms';
import { db } from '../../../lib/firebase';

const PracticeEditDetail: FC = () => {
  //Global State
  const user = useRecoilValue(userAuthState);
  const dateId = useRecoilValue(selectedDateIdState);
  const [isComposed, setIsComposed] = useRecoilState(isComposedState);

  //Local State
  const [menus, setMenus] = useState<Menu[]>([]),
    [name, setName] = useState(''),
    [toggleMenu, setToggleMenu] = useState(false),
    [errorMessage, setErrorMessage] = useState('');

  //ページ訪問時 & 選択された日付が変わった時
  useEffect(() => {
    fetchPracticeData();
  }, [user, dateId]);

  useEffect(() => {
    setErrorMessage('');
  }, [name]);

  //firestoreから選択された日付のデータを取ってくる処理
  const fetchPracticeData = async () => {
    if (user === null) return;
    const practicesRef = db
      .collection('users')
      .doc(user.uid)
      .collection('practices')
      .where('dateId', '==', dateId);

    await practicesRef.get().then((snapshot) => {
      let menusData: Menu[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Menu;
        menusData.push(data);
      });
      setMenus(menusData);
    });
  };

  //メニュー追加処理
  const addMenu = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (isComposed) return;
    if (name === '') {
      setErrorMessage('練習メニューを登録してください');
      return;
    }
    if (
      name !== '10' &&
      name !== '30' &&
      name !== '50' &&
      name !== '60' &&
      name !== '80' &&
      name !== '100' &&
      name !== '120' &&
      name !== '150' &&
      name !== '200' &&
      name !== '250' &&
      name !== '300' &&
      name !== '350' &&
      name !== '400' &&
      name !== '500' &&
      name !== '600' &&
      name !== '800'
    ) {
      setErrorMessage('いつもの練習距離でなければ登録できません。');
      return;
    }
    if (e.key === 'Enter') {
      if (user === null) return;
      const practicesRef = db
        .collection('users')
        .doc(user.uid)
        .collection('practices');
      const menuId = practicesRef.doc().id;
      const newData = { dateId, menuId, name, recodes: [] };
      await practicesRef
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
    if (user === null) return;
    const practicesRef = db
      .collection('users')
      .doc(user.uid)
      .collection('practices')
      .doc(menuId);
    await practicesRef.delete().then(() => {
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

  return (
    <>
      <Heading>練習タイム</Heading>
      <Box mb={8}></Box>

      <Flex justify="space-between" align="center">
        <DatePicker bg="orange.400" />
        <Button
          size="sm"
          shadow="base"
          onClick={() => Router.push(`/practice/${dateId}`)}
        >
          終了
        </Button>
      </Flex>
      <Box mb={8}></Box>

      <Stack spacing={4}>
        {menus &&
          menus.map((menu) => (
            <PracticeEditMenu
              key={menu.menuId}
              items={menu}
              menus={menus}
              setMenus={setMenus}
              deleteMenu={deleteMenu}
            />
          ))}
      </Stack>
      <Box mb={8}></Box>
      {toggleMenu ? (
        <>
          <InputGroup maxW="255px">
            <Input
              autoFocus
              bg="white"
              placeholder="距離"
              value={name}
              onChange={handleChange}
              onKeyDown={addMenu}
              onCompositionStart={() => setIsComposed(true)}
              onCompositionEnd={() => setIsComposed(false)}
              onBlur={handleBlur}
            />
            <InputRightElement children="m" />
          </InputGroup>
          <Box mb={1}></Box>
          <Text color="red.400">{errorMessage}</Text>
        </>
      ) : (
        <Button shadow="base" onClick={() => setToggleMenu(true)}>
          メニューを追加
        </Button>
      )}
    </>
  );
};

export default PracticeEditDetail;
