import { Box, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React, { ReactElement, VFC } from 'react';

import { LinkContent } from '../../../models/users';

type Props = {
  item: LinkContent;
  rightIcon?: ReactElement;
  leftIcon?: ReactElement;
};

const boxStyles = {
  cursor: 'pointer',
  w: '100%',
  h: 200,
  borderRadius: '30px',
  shadow: 'base',
  overflow: 'hidden',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

const boxAfterStyle = {
  content: `""`,
  w: '100%',
  bgGradient: 'linear(to-l,transparent, #000 60%)',
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
};

const backgroundImage = {
  w: '70%',
  h: 200,
  right: -10,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

const textStyle = {
  color: 'white',
  fontSize: ['25px', '30px'],
  fontWeight: 'bold',
  zIndex: '1',
  top: '50%',
  left: '15%',
  transform: 'translateY(-50%)',
  bgGradient: 'linear(to-l, #FF57B9, #A704FD)',
  bgClip: 'text',
};

const LinkBlock: VFC<Props> = ({ item }) => (
  <Link href={`/${item.id}/${item.link}`} passHref>
    <Box pos="relative" {...boxStyles} _after={{ ...boxAfterStyle }}>
      <Box
        pos="absolute"
        backgroundImage={`url(${item.image})`}
        {...backgroundImage}
      />
      <Text pos="absolute" {...textStyle}>
        {item.name}
      </Text>
    </Box>
  </Link>
);

export default LinkBlock;
