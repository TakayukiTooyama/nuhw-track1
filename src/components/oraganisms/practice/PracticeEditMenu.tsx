import { Box, Flex, IconButton, Input, Stack } from '@chakra-ui/react';
import React, { useEffect, useState, VFC } from 'react';
import { AiFillDelete } from 'react-icons/ai';

import { Menu, Recode } from '../../../models/users';
import { PracticeEditRecode, PracticeRecodeCreator } from '..';

type Props = {
  items: Menu;
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
  deleteMenu: (menuId: string) => Promise<void>;
};

const PracticeEditMenu: VFC<Props> = ({ items, setMenus, deleteMenu }) => {
  // Local State
  const [recodes, setRecodes] = useState<Recode[]>(items.recodes);
    const [toggleEdit, setToggleEdit] = useState(false);
    const [index, setIndex] = useState(0);

  // リフレッシュ後でもインデックスを続きから始めるための処理
  useEffect(() => {
    setIndex(recodes.length);
  }, [recodes.length]);

  return (
    <Box bg="white" w="100%" p={4} rounded={5} shadow="base">
      <Flex justify="space-between" align="center">
        <Input
          maxW="255px"
          textAlign="center"
          isReadOnly
          value={items.name}
          mr={2}
        />
        <IconButton
          aria-label="menu-delete"
          shadow="inner"
          onClick={() => deleteMenu(items.menuId)}
          icon={<AiFillDelete fontSize="20px" />}
        />
      </Flex>
      <Box mb={4} />

      <Stack spacing={1}>
        {recodes &&
          recodes.map((recode, idx) => (
            <PracticeEditRecode
              key={`practices-${idx}-${recode.recodeId}`}
              menuId={items.menuId}
              idx={idx}
              setIndex={setIndex}
              items={recode}
              recodes={recodes}
              setRecodes={setRecodes}
            />
          ))}
      </Stack>
      <Box mb={4} />

      <PracticeRecodeCreator
        menuId={items.menuId}
        index={index}
        setIndex={setIndex}
        recodes={recodes}
        setRecodes={setRecodes}
        setMenus={setMenus}
        toggleEdit={toggleEdit}
        setToggleEdit={setToggleEdit}
      />
    </Box>
  );
};

export default PracticeEditMenu;
