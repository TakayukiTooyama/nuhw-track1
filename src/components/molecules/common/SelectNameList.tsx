import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React, { VFC } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  makedMenuNameListState,
  selectedMakedMenuNameState,
} from '../../../recoil/users/user';

const SelectNameList: VFC = () => {
  const [selectedName, setSelectedName] = useRecoilState(
    selectedMakedMenuNameState
  );
  const nameList = useRecoilValue(makedMenuNameListState);
  // ソートしたメニューの名前リスト

  const sortNameList = nameList
    .slice()
    .sort((a: any, b: any) => a.match(/\d+/) - b.match(/\d+/));

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        bg="gray.100"
        border="2px solid"
        borderColor="gray.300"
        borderRadius="30px"
        w="100%"
        maxW={['220px', '300px', '350px']}
      >
        {selectedName}
      </MenuButton>
      <MenuList>
        {sortNameList.length ? (
          sortNameList.map((item) => (
            <MenuItem key={item} onClick={() => setSelectedName(item)}>
              {item}
            </MenuItem>
          ))
        ) : (
          <MenuItem>未登録</MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export default SelectNameList;
