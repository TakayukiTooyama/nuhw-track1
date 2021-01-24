import { ArrowUpIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import React, { VFC } from 'react';

const TopScrollButton: VFC = () => (
    <IconButton
      aria-label="top-scroll"
      shadow="base"
      borderRadius="50%"
      pos="fixed"
      bottom="48px"
      right="16px"
      onClick={() => window.scrollTo(0, 0)}
      icon={<ArrowUpIcon />}
    />
  );

export default TopScrollButton;
