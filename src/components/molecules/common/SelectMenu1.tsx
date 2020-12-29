import React, { FC, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

type Props = {
  label: string;
  contents: string[];
  setName: React.Dispatch<React.SetStateAction<string>>;
  maxW?: string;
};

const SelectMenu: FC<Props> = ({ label, contents, setName, maxW }) => {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Button
        w="100%"
        shadow="base"
        fontWeight="normal"
        rightIcon={<ChevronDownIcon />}
        onClick={() => setOpen((prev) => !prev)}
      >
        {label}
      </Button>
      <Box mb={1} />
      {open
        ? contents.map((item) => (
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              p={[1, 2]}
              onClick={() => {
                setOpen(false), setName(item);
              }}
            >
              {item}
            </Box>
          ))
        : null}
    </Box>
    // <Menu>
    //   <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
    //     {label}
    //   </MenuButton>
    //   <MenuList>
    //     {contents.map((item) => (
    //       <MenuItem key={item} onClick={() => setName(item)}>
    //         {item}
    //       </MenuItem>
    //     ))}
    //   </MenuList>
    // </Menu>
  );
};

export default SelectMenu;
