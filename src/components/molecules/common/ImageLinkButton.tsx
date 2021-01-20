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
};

const backImageStyle = {
  w: '100%',
  h: '200px',
  backgroundSize: 'cover',
  backgroundPosition: 'center 70%',
  backgroundRepeat: 'no-repeat',
};

const LinkBlock: VFC<Props> = ({ item }) => {
  return (
    <Link href={`/${item.id}/${item.link}`} passHref>
      <Box pos="relative" {...buttonStyles} _hover={{ borderRadius: '30px' }}>
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
          _hover={{ opacity: 1, transition: 'opacity 0.3s ease-out' }}
        >
          <Box
            pos="absolute"
            backgroundImage={`url(${item.image})`}
            {...backImageStyle}
            _hover={{
              transform: 'scale(1.2)',
              transition: 'transform 0.6s ease-out',
            }}
          />
        </Box>
      </Box>
    </Link>
  );
};

export default LinkBlock;
