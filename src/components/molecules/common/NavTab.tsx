import { Box, Icon, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React, { VFC } from 'react';
import { IconType } from 'react-icons/lib';

type Props = {
  name: string;
  icon: IconType;
  link: string;
};

const NavTab: VFC<Props> = ({ name, icon, link }) => (
  <Link href={link} passHref text-align="center">
    <Box
      flex="1"
      py={2}
      cursor="pointer"
      _hover={{ bg: 'gray.100' }}
      bg="white"
    >
      <Icon as={icon} fontSize="20px" />
      <Text variant="sub" fontSize="8px">
        {name}
      </Text>
    </Box>
  </Link>
);

export default NavTab;
