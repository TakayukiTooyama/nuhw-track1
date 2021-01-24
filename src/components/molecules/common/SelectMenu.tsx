import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { TournamentData } from '../../../models/users';
import { selectedTournamentDataState } from '../../../recoil/users/user';

type Props = {
  name: string;
  dataList: TournamentData[];
};

const BoxStyle = {
  shadow: 'base',
  align: 'center',
  py: 2,
  bg: 'white',
  cursor: 'pointer',
  _hover: { bg: 'gray.50' },
};

const SelectMenu: FC<Props> = ({ name, dataList }) => {
  // Global State
  const setSelectedData = useSetRecoilState(selectedTournamentDataState);

  // Locla State
  const [toggleMenu, setToggleMenu] = useState(false);

  const selectedMenu = (data: TournamentData) => {
    setSelectedData(data);
    setToggleMenu(false);
  };

  return (
    <Box pos="relative">
      <Button
        rightIcon={<ChevronDownIcon fontSize={['2xl', '3xl']} />}
        w="100%"
        textAlign="center"
        fontSize={['lg', 'xl']}
        borderRadius={toggleMenu ? '0px' : '5px'}
        onClick={() => setToggleMenu(!toggleMenu)}
      >
        {name}
      </Button>
      {toggleMenu ? (
        <Box zIndex={1} pos="absolute" w="100%" mx="auto" top="43px">
          {dataList.length ? (
            dataList.map((data) => (
              <Box
                key={data.id}
                {...BoxStyle}
                onClick={() => selectedMenu(data)}
              >
                {data.name}
              </Box>
            ))
          ) : (
            <Box {...BoxStyle}>参加した大会がありません</Box>
          )}
        </Box>
      ) : null}
    </Box>
  );
};

export default SelectMenu;
