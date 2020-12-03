import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from '@chakra-ui/react';
import { AiFillDelete } from 'react-icons/ai';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { Menu } from '../../../models/users';

import {
  isComposedState,
  selectedDateIdState,
  userAuthState,
} from '../../../recoil/users/user';
import { db } from '../../../lib/firebase';
import { PracticeEditRecode, PracticeRecodeCreator } from '..';

type Props = {
  items: Menu;
  menus: Menu[];
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
  deleteMenu: (menuId: string) => void;
};

const PracticeEditMenu: FC<Props> = ({
  items,
  menus,
  setMenus,
  deleteMenu,
}) => {
  //Global state
  const user = useRecoilValue(userAuthState);
  const dateId = useRecoilValue(selectedDateIdState);
  const isComposed = useRecoilValue(isComposedState);
  const setIsComposed = useSetRecoilState(isComposedState);

  //Local State
  const [recodes, setRecodes] = useState(items.recodes),
    [name, setName] = useState(items.name),
    [toggleEdit, setToggleEdit] = useState(false),
    [index, setIndex] = useState(0);

  //メニュー名編集処理
  const editMenuName = async (
    e: React.KeyboardEvent<HTMLElement>,
    menuId: string
  ) => {
    if (user === null || user === undefined) return;
    if (isComposed) return;
    const practicesRef = db
      .collection('users')
      .doc(user.uid)
      .collection('practices')
      .doc(menuId);
    if (e.key === 'Enter') {
      await practicesRef.update({ name }).then(() => {
        const idx = menus.findIndex((menu) => menu.menuId === menuId);
        menus[idx] = { dateId, menuId, name, recodes };
        setMenus(menus);
        setToggleEdit(true);
      });
    }
  };

  //リフレッシュ後でもインデックスを続きから始めるための処理
  useEffect(() => {
    setIndex(recodes.length);
  }, [recodes.length]);

  //メニューの名前を変更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <Box bg="white" w="100%" p={4} rounded={5} shadow="base">
      <Flex justify="space-between" align="center">
        <InputGroup maxW="255px" mr={1}>
          <Input
            textAlign="center"
            readOnly={true}
            value={name}
            onChange={handleChange}
            onKeyDown={(e) => editMenuName(e, items.menuId)}
            onCompositionStart={() => setIsComposed(true)}
            onCompositionEnd={() => setIsComposed(false)}
          />
          <InputRightElement children="m" />
        </InputGroup>

        <IconButton
          aria-label="menu-delete"
          shadow="inner"
          onClick={() => deleteMenu(items.menuId)}
        >
          <AiFillDelete fontSize="20px" />
        </IconButton>
      </Flex>
      <Box mb={4}></Box>

      <Stack spacing={1}>
        {recodes &&
          recodes.map((recode, idx) => (
            <PracticeEditRecode
              key={`practices-${idx}-${recode.recodeId}`}
              items={recode}
              idx={idx}
              menuId={items.menuId}
              setIndex={setIndex}
              recodes={recodes}
              setRecodes={setRecodes}
            />
          ))}
      </Stack>
      <Box mb={4}></Box>

      <PracticeRecodeCreator
        index={index}
        menuId={items.menuId}
        recodes={recodes}
        setIndex={setIndex}
        setRecodes={setRecodes}
        setMenus={setMenus}
        toggleEdit={toggleEdit}
        setToggleEdit={setToggleEdit}
      />
    </Box>
  );
};

export default PracticeEditMenu;
