import {
  Box,
  Flex,
  IconButton,
  Input,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';

import { TournamentMenu, TournamentRecord } from '../../../models/users';
import {
  MenuDeleteModal,
  TournamentEditRecord,
  TournamentRecordCreator,
} from '..';
import { DeleteIcon } from '@chakra-ui/icons';

type Props = {
  items: TournamentMenu;
  deleteMenu: (menuId: string) => Promise<void>;
};

const TournamentEditMenu: FC<Props> = ({ items, deleteMenu }) => {
  // Local State
  const [records, setRecords] = useState<TournamentRecord[]>(items.records);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [index, setIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log(records);
  useEffect(() => {
    setIndex(records?.length);
  }, [records]);

  return (
    <>
      <Box bg="white" w="100%" p={4} rounded={5} shadow="base">
        <Flex justify="space-between" align="center" mb={4}>
          <Input
            maxW="255px"
            mr={1}
            textAlign="center"
            isReadOnly
            value={items.competitionName}
          />
          <IconButton
            aria-label="menu-delete"
            shadow="inner"
            bg="red.200"
            onClick={onOpen}
            icon={<DeleteIcon />}
          />
        </Flex>

        {records && records?.length > 0 && (
          <Stack spacing={2} mb={4}>
            {records.map((record, idx) => (
              <TournamentEditRecord
                key={`tournament-${idx}-${record.recordId}`}
                items={record}
                menu={items}
                menuId={items.menuId}
                setIndex={setIndex}
                records={records}
                setRecords={setRecords}
                setToggleEdit={setToggleEdit}
              />
            ))}
          </Stack>
        )}

        <TournamentRecordCreator
          index={index}
          menuId={items.menuId}
          records={records}
          setIndex={setIndex}
          setRecords={setRecords}
          menu={items}
          toggleEdit={toggleEdit}
          setToggleEdit={setToggleEdit}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
        <MenuDeleteModal
          title={items.competitionName}
          isOpen={isOpen}
          onClose={onClose}
          onDelete={() => deleteMenu(items.menuId)}
        />
      </Box>
    </>
  );
};

export default TournamentEditMenu;
