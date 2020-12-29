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
        onClick={() => setToggleMenu(!toggleMenu)}
      >
        <Heading fontSize={['xl', '2xl']}>{name}</Heading>
      </Button>
      <Divider />
      {toggleMenu ? (
        <Box zIndex={1} pos="absolute" w="100%" mx="auto">
          {dataList &&
            dataList.map((data) => (
              <Box
                key={data.id}
                shadow="base"
                textAlign="center"
                py={2}
                bg="white"
                cursor="pointer"
                _hover={{ bg: 'gray.50' }}
                onClick={() => selectedMenu(data)}
              >
                {data.name}
              </Box>
            ))}
        </Box>
      ) : null}
    </Box>
  );
};

export default SelectMenu;
