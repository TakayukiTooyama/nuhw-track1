import {
  Box,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';

import { WeightMenu } from '../../../models/users';
import { MenuDeleteModal, WeightEditRecord, WeightRecordCreator } from '..';

type Props = {
  items: WeightMenu;
  setMenus: React.Dispatch<React.SetStateAction<WeightMenu[]>>;
  deleteMenu: (menuId: string) => Promise<void>;
};

const WeightEditMenu: FC<Props> = ({ items, setMenus, deleteMenu }) => {
  // Local State
  const [records, setRecords] = useState(items.records);
  const [index, setIndex] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // リフレッシュ後でもインデックスを続きから始めるための処理
  useEffect(() => {
    setIndex(records?.length);
  }, [records?.length]);

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
          onClick={onOpen}
          icon={<DeleteIcon />}
        />
      </Flex>
      <Box mb={4} />

      <Stack spacing={2} mb={4}>
        {records &&
          records.map((record, idx) => (
            <WeightEditRecord
              key={`practices-${idx}-${record.recordId}`}
              name={items.name}
              items={record}
              idx={idx}
              index={index}
              menuId={items.menuId}
              setIndex={setIndex}
              records={records}
              setRecords={setRecords}
            />
          ))}
      </Stack>

      <WeightRecordCreator
        name={items.name}
        index={index}
        menuId={items.menuId}
        records={records}
        setIndex={setIndex}
        setRecords={setRecords}
        setMenus={setMenus}
      />
      <MenuDeleteModal
        title={items.name}
        isOpen={isOpen}
        onClose={onClose}
        onDelete={() => deleteMenu(items.menuId)}
      />
    </Box>
  );
};

export default WeightEditMenu;
