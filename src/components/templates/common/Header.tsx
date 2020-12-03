import React, { FC } from 'react';
import Link from 'next/link';
import { Box, Divider, Heading } from '@chakra-ui/react';

import GuideMenu from '../../oraganisms/common/GuideMenu';

type Props = {
  avatar?: string;
};

const Header: FC<Props> = ({ avatar = '/no-profile.png' }) => {
  return (
    <>
      <Box color="grey" py={2} px={4}>
        <Box
          maxW="6xl"
          mx="auto"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Link href="/">
            <Heading as="h1" size="md">
              NUHW TRACK
            </Heading>
          </Link>
          <GuideMenu avatar={avatar} />
        </Box>
      </Box>
      <Divider />
    </>
  );
};

export default Header;
