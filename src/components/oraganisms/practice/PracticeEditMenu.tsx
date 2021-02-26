import {
  Box,
  Flex,
  IconButton,
  Input,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState, VFC } from 'react';

import { Menu, Record } from '../../../models/users';
import { MenuDeleteModal, PracticeEditRecode, PracticeRecodeCreator } from '..';
import { DeleteIcon } from '@chakra-ui/icons';

type Props = {
  items: Menu;
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
  deleteMenu: (menuId: string) => Promise<void>;
};

const PracticeEditMenu: VFC<Props> = ({ items, setMenus, deleteMenu }) => {
  // Local State
  const [recodes, setRecodes] = useState<Record[]>(items.recodes);
  const [index, setIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // リフレッシュ後でもインデックスを続きから始めるための処理
  useEffect(() => {
    setIndex(recodes.length);
  }, [recodes.length]);

  return (
    <>
      <Box bg="white" w="100%" p={4} rounded={5} shadow="base">
        <Flex justify="space-between" align="center">
          <Input
            maxW="260px"
            textAlign="center"
            isReadOnly
            value={items.name}
            mr={2}
          />
          <IconButton
            bg="red.200"
            aria-label="menu-delete"
            shadow="inner"
            onClick={() => onOpen()}
            icon={<DeleteIcon fontSize="20px" />}
          />
        </Flex>
        <Box mb={4} />

        <Stack spacing={2}>
          {recodes &&
            recodes.map((record, idx) => (
              <PracticeEditRecode
                key={`practices-${idx}-${record.recodeId}`}
                name={items.name}
                menuId={items.menuId}
                idx={idx}
                index={index}
                items={record}
                recodes={recodes}
                setIndex={setIndex}
                setRecodes={setRecodes}
              />
            ))}
        </Stack>
        <Box mb={4} />

        <PracticeRecodeCreator
          name={items.name}
          menuId={items.menuId}
          index={index}
          recodes={recodes}
          setIndex={setIndex}
          setRecodes={setRecodes}
          setMenus={setMenus}
        />
      </Box>
      <MenuDeleteModal
        title={items.name}
        isOpen={isOpen}
        onClose={onClose}
        onDelete={() => deleteMenu(items.menuId)}
      />
    </>
  );
};

export default PracticeEditMenu;
