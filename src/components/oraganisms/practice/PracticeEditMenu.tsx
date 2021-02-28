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
import { MenuDeleteModal, PracticeEditRecord, PracticeRecordCreator } from '..';
import { DeleteIcon } from '@chakra-ui/icons';

type Props = {
  items: Menu;
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
  deleteMenu: (menuId: string) => Promise<void>;
};

const PracticeEditMenu: VFC<Props> = ({ items, setMenus, deleteMenu }) => {
  // Local State
  const [records, setRecords] = useState<Record[]>(items.records);
  const [index, setIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // リフレッシュ後でもインデックスを続きから始めるための処理
  useEffect(() => {
    setIndex(records?.length);
  }, [records?.length]);

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
            onClick={onOpen}
            icon={<DeleteIcon fontSize="20px" />}
          />
        </Flex>
        <Box mb={4} />

        <Stack spacing={2}>
          {records &&
            records.map((record, idx) => (
              <PracticeEditRecord
                key={`practices-${idx}-${record.recordId}`}
                name={items.name}
                menuId={items.menuId}
                idx={idx}
                index={index}
                items={record}
                records={records}
                setIndex={setIndex}
                setRecords={setRecords}
              />
            ))}
        </Stack>
        <Box mb={4} />

        <PracticeRecordCreator
          name={items.name}
          menuId={items.menuId}
          index={index}
          records={records}
          setIndex={setIndex}
          setRecords={setRecords}
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
