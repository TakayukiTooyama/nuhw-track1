import {
  Box,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';

import { WeightMenu } from '../../../models/users';
import { WeightEditRecode, WeightRecodeCreator } from '..';

type Props = {
  items: WeightMenu;
  setMenus: React.Dispatch<React.SetStateAction<WeightMenu[]>>;
  deleteMenu: (menuId: string) => void;
};

const WeightEditMenu: FC<Props> = ({ items, setMenus, deleteMenu }) => {
  // Local State
  const [recodes, setRecodes] = useState(items.recodes);
  const [name] = useState(items.name);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [index, setIndex] = useState(0);

  // リフレッシュ後でもインデックスを続きから始めるための処理
  useEffect(() => {
    setIndex(recodes.length);
  }, [recodes.length]);

  return (
    <Box bg="white" w="100%" p={4} rounded={5} shadow="base">
      <Flex justify="space-between" align="center">
        <InputGroup w="100%" maxW="300px" mr={1}>
          <Input defaultValue={name} readOnly />
          <InputRightElement
            color="gray.400"
            children={`${items.rm}RM`}
            pr={4}
          />
        </InputGroup>
        <IconButton
          aria-label="menu-delete"
          shadow="inner"
          bg="red.200"
          onClick={() => deleteMenu(items.menuId)}
          icon={<AiFillDelete fontSize="20px" />}
        />
      </Flex>
      <Box mb={4} />

      <Stack spacing={1}>
        {recodes &&
          recodes.map((recode, idx) => (
            <WeightEditRecode
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
      <Box mb={4} />

      <WeightRecodeCreator
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

export default WeightEditMenu;
