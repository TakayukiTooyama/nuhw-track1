import React, { FC } from 'react';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

type Props = {
  label: string;
  contents: string[];
  setName: React.Dispatch<React.SetStateAction<string>>;
};

const SelectMenu: FC<Props> = ({ label, contents, setName }) => {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {label}
      </MenuButton>
      <MenuList>
        {contents.map((item) => (
          <MenuItem key={item} onClick={() => setName(item)}>
            {item}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default SelectMenu;
