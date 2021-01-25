import { Box, Container } from '@chakra-ui/react';
import Head from 'next/head';
import React, { FC, ReactNode } from 'react';

import { NavBar } from '../../oraganisms';
import Header from './Header';

type Props = {
  children: ReactNode;
  title: string;
  noHeader?: boolean;
};

const Layout: FC<Props> = ({
  children,
  title = 'NUHW TRACK',
  noHeader = false,
}) => (
  <Box h="100%">
    <Head>
      <title>{title}</title>
    </Head>
    {noHeader ? null : <Header />}
    <Container pt={8} pb={16} zIndex={2}>
      {children}
    </Container>
    {noHeader ? null : <NavBar />}
  </Box>
);

export default Layout;
