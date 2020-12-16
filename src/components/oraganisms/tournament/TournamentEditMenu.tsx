import React, { FC, useEffect, useState } from 'react';
import { Box, Flex, IconButton, Input, Stack } from '@chakra-ui/react';
import { AiFillDelete } from 'react-icons/ai';
import { TournamentEditRecode, TournamentRecodeCreator } from '..';
import { TournamentMenu, TournamentRecode } from '../../../models/users';

type Props = {
  items: TournamentMenu;
  deleteMenu: (menuId: string) => Promise<void>;
};

const TournamentEditMenu: FC<Props> = ({ items, deleteMenu }) => {
  //Local State
  const [recodes, setRecodes] = useState<TournamentRecode[]>(items.recodes),
    [toggleEdit, setToggleEdit] = useState(false),
    [index, setIndex] = useState(0),
    [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setIndex(recodes.length);
  }, [recodes.length]);

  return (
    <>
      <Box bg="white" w="100%" p={4} rounded={5} shadow="base">
        <Flex justify="space-between" align="center">
          <Input
            maxW="255px"
            mr={1}
            textAlign="center"
            readOnly={true}
            value={items.competitionName}
          />
          <IconButton
            aria-label="menu-delete"
            shadow="inner"
            onClick={() => deleteMenu(items.menuId)}
          >
            <AiFillDelete fontSize="20px" />
          </IconButton>
        </Flex>
        <Stack spacing={1}>
          {recodes &&
            recodes.map((recode, idx) => (
              <TournamentEditRecode
                key={`tournament-${idx}-${recode.recodeId}`}
                items={recode}
                menu={items}
                menuId={items.menuId}
                setIndex={setIndex}
                recodes={recodes}
                setRecodes={setRecodes}
                setToggleEdit={setToggleEdit}
              />
            ))}
        </Stack>
        <Box mb={4}></Box>

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
