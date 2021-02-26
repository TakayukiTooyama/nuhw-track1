import { Box, Flex, IconButton, Input, Stack } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';

import { TournamentMenu, TournamentRecode } from '../../../models/users';
import { TournamentEditRecode, TournamentRecodeCreator } from '..';
import { DeleteIcon } from '@chakra-ui/icons';

type Props = {
  items: TournamentMenu;
  deleteMenu: (menuId: string) => Promise<void>;
};

const TournamentEditMenu: FC<Props> = ({ items, deleteMenu }) => {
  // Local State
  const [recodes, setRecodes] = useState<TournamentRecode[]>(items.recodes);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [index, setIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setIndex(recodes.length);
  }, [recodes.length]);

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
            onClick={() => deleteMenu(items.menuId)}
            icon={<DeleteIcon />}
          />
        </Flex>

        {recodes.length > 0 && (
          <Stack spacing={2} mb={4}>
            {recodes.map((record, idx) => (
              <TournamentEditRecode
                key={`tournament-${idx}-${record.recodeId}`}
                items={record}
                menu={items}
                menuId={items.menuId}
                setIndex={setIndex}
                recodes={recodes}
                setRecodes={setRecodes}
                setToggleEdit={setToggleEdit}
              />
            ))}
          </Stack>
        )}

        <TournamentRecodeCreator
          index={index}
          menuId={items.menuId}
          recodes={recodes}
          setIndex={setIndex}
          setRecodes={setRecodes}
          menu={items}
          toggleEdit={toggleEdit}
          setToggleEdit={setToggleEdit}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      </Box>
    </>
  );
};

export default TournamentEditMenu;
