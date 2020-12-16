import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, Heading } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { TournamentData } from '../../../models/users';
import { selectedTournamentDataState } from '../../../recoil/users/user';

type Props = {
  name: string;
  dataList: TournamentData[];
};

const SelectMenu: FC<Props> = ({ name, dataList }) => {
  //Global State
  const setSelectedData = useSetRecoilState(selectedTournamentDataState);

  //Locla State
  const [toggleMenu, setToggleMenu] = useState(false);

  const selectedMenu = (data: TournamentData) => {
    setSelectedData(data);
    setToggleMenu(false);
  };

  return (
    <Box pos="relative">
      <Button
        rightIcon={<ChevronDownIcon fontSize="2xl" />}
        w="100%"
        textAlign="center"
        bg="green.50"
        onClick={() => setToggleMenu(!toggleMenu)}
      >
        <Heading fontSize={['xl', '2xl']}>{name}</Heading>
      </Button>
      <Divider />
      {toggleMenu
        ? dataList.map((data) => (
            <Box
              key={data.id}
              pos="absolute"
              zIndex={1}
              shadow="base"
              w="100%"
              mx="auto"
              textAlign="center"
              py={2}
              bg="white"
              cursor="pointer"
              _hover={{ bg: 'gray.50' }}
              onClick={() => selectedMenu(data)}
            >
              {data.name}
            </Box>
          ))
        : null}
    </Box>
  );
};

export default SelectMenu;
