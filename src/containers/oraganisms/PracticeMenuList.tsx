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
import { Menu } from '../../models/users';
import EditTable from '../moleclus/EditTable';
import RecodeCreator from './RecodeCreator';

type Props = {
  items: Menu;
  menus: Menu[];
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
  deleteMenu: (menuId: string) => void;
  saveToggle: boolean;
  setSaveToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

const PracticeMenuList: FC<Props> = ({
  items,
  menus,
  setMenus,
  deleteMenu,
  saveToggle,
  setSaveToggle,
}) => {
  //Local State
  const [recodes, setRecodes] = useState(items.recodes),
    [name, setName] = useState(items.name),
    [index, setIndex] = useState(0);

  //リフレッシュ後でもインデックスを続きから始めるための処理
  useEffect(() => {
    setIndex(recodes.length);
  }, [recodes.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <Box bg="white" w="100%" p={4} rounded={5} shadow="base">
      <Flex justify="space-between" align="center">
        <InputGroup maxW="255px" mr={1}>
          <Input textAlign="center" value={name} onChange={handleChange} />
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
            <EditTable
              key={`practices-${idx}-${recode.recodeId}`}
              items={recode}
              idx={idx}
              index={index}
              setIndex={setIndex}
              recodes={recodes}
              setRecodes={setRecodes}
              setSaveToggle={setSaveToggle}
            />
          ))}
      </Stack>
      <Box mb={4}></Box>

      <RecodeCreator
        index={index}
        menus={menus}
        setIndex={setIndex}
        setRecodes={setRecodes}
        setMenus={setMenus}
        name={name}
        recodes={recodes}
        items={items}
        saveToggle={saveToggle}
        setSaveToggle={setSaveToggle}
      />
    </Box>
  );
};

export default PracticeMenuList;
