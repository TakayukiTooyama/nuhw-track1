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
import { DeleteIcon } from '@chakra-ui/icons';

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
  const [index, setIndex] = useState(0);

  // リフレッシュ後でもインデックスを続きから始めるための処理
  useEffect(() => {
    setIndex(recodes.length);
  }, [recodes.length]);

  return (
    <Box bg="white" w="100%" p={4} rounded={5} shadow="base">
      <Flex justify="space-between" align="center">
        <InputGroup w="100%" maxW="300px" mr={1}>
          <Input defaultValue={items.name} readOnly />
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
          icon={<DeleteIcon />}
        />
      </Flex>
      <Box mb={4} />

      {recodes.length > 0 && (
        <Stack spacing={2} mb={4}>
          {recodes.map((record, idx) => (
            <WeightEditRecode
              key={`practices-${idx}-${record.recodeId}`}
              name={items.name}
              items={record}
              idx={idx}
              index={index}
              menuId={items.menuId}
              setIndex={setIndex}
              recodes={recodes}
              setRecodes={setRecodes}
            />
          ))}
        </Stack>
      )}

      <WeightRecodeCreator
        name={items.name}
        index={index}
        menuId={items.menuId}
        recodes={recodes}
        setIndex={setIndex}
        setRecodes={setRecodes}
        setMenus={setMenus}
      />
    </Box>
  );
};

export default WeightEditMenu;
