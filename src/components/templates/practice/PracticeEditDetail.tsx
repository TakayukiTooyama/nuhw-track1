import React, { useEffect, VFC } from 'react';
import { Box, Button, Flex, Heading, Stack } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import DatePicker from '../../molecules/common/DatePicker';
import { selectedDateIdState, userAuthState } from '../../../recoil/users/user';
import { Menu } from '../../../models/users';
import { PracticeEditMenu } from '../../oraganisms';
import usePracticeMenu from '../../../hooks/usePracticeMenu';
import { db } from '../../../lib/firebase';
import { LinkButton, InputKeyDown, ErrorMessage } from '../../molecules';

export const PracticeEditDetail: VFC = () => {
  //カスタムフック
  const {
    menus,
    setMenus,
    name,
    addMenu,
    toggleMenu,
    setToggleMenu,
    setErrorMessage,
    errorMessage,
    handleChange,
    handleBlur,
    deleteMenu,
  } = usePracticeMenu([]);

  //Global State
  const user = useRecoilValue(userAuthState);
  const dateId = useRecoilValue(selectedDateIdState);

  // //ページ訪問時 & 選択された日付が変わった時
  useEffect(() => {
    fetchPracticeData();
  }, [user, dateId]);

  const fetchPracticeData = async () => {
    if (user === null) return;
    const practicesDoc = await db
      .collection('users')
      .doc(user.uid)
      .collection('practices')
      .where('dateId', '==', dateId)
      .get();

    const menusData: Menu[] = practicesDoc.docs.map((doc) => {
      const menuDoc = doc.data() as Menu;
      return {
        ...menuDoc,
      };
    });
    setMenus(menusData);
  };

  useEffect(() => {
    setErrorMessage('');
  }, [name]);

  return (
    <>
      <Heading>練習タイム</Heading>
      <Box mb={8} />

      <Flex justify="space-between" align="center">
        <DatePicker bg="orange.400" />
        <LinkButton label="終了" link={`/practice/${dateId}`} />
      </Flex>
      <Box mb={8} />

      <Stack spacing={4}>
        {menus &&
          menus.map((menu) => (
            <PracticeEditMenu
              key={menu.menuId}
              items={menu}
              setMenus={setMenus}
              deleteMenu={deleteMenu}
            />
          ))}
      </Stack>
      <Box mb={8} />

      {toggleMenu ? (
        <>
          <InputKeyDown
            value={name}
            placeholder="記録"
            unit="m"
            addFunc={addMenu}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
          <Box mb={1} />
          <ErrorMessage message={errorMessage} />
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
