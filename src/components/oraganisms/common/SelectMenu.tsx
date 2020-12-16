import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { db } from '../../../lib/firebase';

import { TournamentData } from '../../../models/users';
import {
  selectedTournamentDataState,
  userAuthState,
} from '../../../recoil/users/user';

type Props = {
  dataList: TournamentData[];
};

const SelectMenu: FC<Props> = ({ dataList }) => {
  //Global State
  const user = useRecoilValue(userAuthState);
  const setSelectedTournamentData = useSetRecoilState(
    selectedTournamentDataState
  );

  //Local State
  const [label, setLabel] = useState('選択してください');

  const dataListOnClick = (data: TournamentData) => {
    if (user === null) return;
    const tournamentsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('tournaments');
    const id = tournamentsRef.doc().id;

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
