import { Box, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React, { ReactElement, VFC } from 'react';
import { LinkContent } from '../../../models/users';

type Props = {
  item: LinkContent;
  rightIcon?: ReactElement;
  leftIcon?: ReactElement;
};

const buttonStyles = {
  borderRadius: '30px',
  shadow: 'base',
  w: '100%',
  h: 200,
  color: 'white',
  overflow: 'hidden',
  bg: 'gray.900',
  zIndex: 0,
};

const backImageStyle = {
  w: '100%',
  h: 200,
  backgroundSize: 'cover',
  backgroundPosition: 'center 70%',
  backgroundRepeat: 'no-repeat',
};

const LinkBlock: VFC<Props> = ({ item }) => {
  return (
    <Link href={`/${item.id}/${item.link}`} passHref>
      <Box pos="relative" {...buttonStyles}>
        <Text
          pos="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%,-50%)"
          fontSize="25px"
          fontWeight="bold"
          zIndex="1"
        >
          {item.name}
        </Text>
        <Box
          opacity="0.3"
          transition="all 0.3s"
          _hover={{ opacity: 1, transition: 'all 0.3s' }}
        >
          <Box
            pos="absolute"
            backgroundImage={`url(${item.image})`}
            {...backImageStyle}
            transition="all 0.6s"
            _hover={{
              transform: 'scale(1.2)',
              transition: 'all 0.6s',
            }}
          />
        </Box>
      </Box>
    </Link>
  );
};

export default LinkBlock;
