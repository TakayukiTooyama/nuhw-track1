import { Box, Button, Flex, Heading, Stack } from '@chakra-ui/react';
import React, { useEffect, VFC } from 'react';
import { useRecoilValue } from 'recoil';

import usePracticeMenu from '../../../hooks/usePracticeMenu';
import { fetchPracticeData } from '../../../lib/firestore/users';
import { selectedDateIdState, userState } from '../../../recoil/users/user';
import { ErrorMessage, InputKeyDown, LinkButton } from '../../molecules';
import DatePicker from '../../molecules/common/DatePicker';
import { PracticeEditMenu } from '../../oraganisms';

export const PracticeEditDetail: VFC = () => {
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

  const user = useRecoilValue(userState);
  const dateId = useRecoilValue(selectedDateIdState);

  // ページ訪問時 & 選択された日付が変わった時
  useEffect(() => {
    fetchPracticeData(user, dateId, setMenus);
  }, [user, dateId, setMenus]);

  // 練習メニュー名に変更があった時
  useEffect(() => {
    setErrorMessage('');
  }, [name, setErrorMessage]);

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
