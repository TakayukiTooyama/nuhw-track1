import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { TournamentData } from '../../../models/users';
import { selectedTournamentDataState } from '../../../recoil/users/user';

type Props = {
  dataList: TournamentData[];
};

const SelectMenu: FC<Props> = ({ dataList }) => {
  // Global State
  const setSelectedTournamentData = useSetRecoilState(
    selectedTournamentDataState
  );

  // Local State
  const [label, setLabel] = useState('選択してください');

  const dataListOnClick = (data: TournamentData) => {
    setLabel(data.name);
    setSelectedTournamentData(data);
  };

  return (
    <Menu>
      <MenuButton as={Button} shadow="base" rightIcon={<ChevronDownIcon />}>
        {label}
      </MenuButton>
      <MenuList>
        {dataList &&
          dataList.map((data) => (
            <MenuItem key={data.id} onClick={() => dataListOnClick(data)}>
              {data.name}
            </MenuItem>
          ))}
      </MenuList>
    </Menu>
  );
};

export default SelectMenu;
