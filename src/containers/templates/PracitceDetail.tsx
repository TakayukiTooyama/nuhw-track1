import PracticeMenuList from '../oraganisms/PracticeMenuList';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from '@chakra-ui/react';
import { db } from '../../lib/firebase';
import { useRecoilValue } from 'recoil';
import {
  userAuthState,
  selectedDateIdState,
  selectedDateState,
} from '../../recoil/user';
import { Menu } from '../../models/users';
import DatePicker from '../../components/molecules/DatePicker';
import View from '../../components/templates/practices/View';

const PracitceDetail = () => {
  //Global State
  const user = useRecoilValue(userAuthState);
  const date = useRecoilValue(selectedDateState);
  const dateId = useRecoilValue(selectedDateIdState); //今選択している日付のId

  //Local State
  const [menus, setMenus] = useState<Menu[]>([]),
    [name, setName] = useState(''),
    [toggleMenu, setToggleMenu] = useState(false),
    [isComposed, setIsComposed] = useState(false),
    [saveToggle, setSaveToggle] = useState(true),
    [edit, setEdit] = useState(false);

  const fetchMenus = async () => {
    if (user === null || user === undefined) return;
    const practicesRef = db
      .collection('users')
      .doc(user.uid)
      .collection('practices');
    await practicesRef.get().then((snapshot) => {
      const menus: Menu[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Menu;
        if (data.dateId === dateId) {
          menus.push(data);
        } else {
          return false;
        }
      });
      setMenus(menus);
    });
  };

  //ページ訪問時に今日の日付の内容を取得
  useEffect(() => {
    fetchMenus();
  }, [user, date]);

  //メニューの名前入力処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  //入力処理を離れる時の処理
  const handleBlur = () => {
    setToggleMenu(false);
    setName('');
  };

  //メニュー追加処理
  const addMenu = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (user === null || user === undefined) return;
    if (name === '') return;
    if (isComposed) return;
    if (e.key === 'Enter') {
      const practicesRef = db
        .collection('users')
        .doc(user.uid)
        .collection('practices');
      const menuId = practicesRef.doc().id;
      const newData = { dateId, menuId, name, recodes: [], save: false };
      await practicesRef
        .doc(menuId)
        .set(newData)
        .then(() => {
          setMenus((prev) => [...prev, newData]);
          setToggleMenu(false);
          setSaveToggle(false);
          setName('');
        });
    }
  };

  //メニュー削除処理
  const deleteMenu = async (menuId: string) => {
    if (user === null || user === undefined) return;
    const practicesRef = db
      .collection('users')
      .doc(user.uid)
      .collection('practices')
      .doc(menuId);
    await practicesRef.delete().then(() => {
      const newMenus = menus.filter((menu) => menu.menuId !== menuId);
      if (newMenus.length === 0) {
        setSaveToggle(true);
      }
      setMenus(newMenus);
    });
  };

  return (
    <>
      <Heading>練習タイム</Heading>
      <Box mb={8}></Box>

      <Flex justify="space-between" align="center">
        <DatePicker />
        {edit ? (
          <Button size="sm" shadow="base" onClick={() => setEdit(false)}>
            Finish
          </Button>
        ) : (
          <Button size="sm" shadow="base" onClick={() => setEdit(true)}>
            Edit
          </Button>
        )}
      </Flex>
      <Box mb={8}></Box>

      {edit ? (
        <>
          <Stack spacing={4}>
            {menus &&
              menus.map((menu) => (
                <PracticeMenuList
                  key={menu.menuId}
                  items={menu}
                  menus={menus}
                  setMenus={setMenus}
                  deleteMenu={deleteMenu}
                  saveToggle={saveToggle}
                  setSaveToggle={setSaveToggle}
                />
              ))}
          </Stack>
          <Box mb={8}></Box>
          {saveToggle ? (
            <>
              {toggleMenu ? (
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
              ) : (
                <Button shadow="base" onClick={() => setToggleMenu(true)}>
                  メニューを追加
                </Button>
              )}
            </>
          ) : null}
        </>
      ) : (
        <View />
      )}
    </>
  );
};

export default PracitceDetail;
