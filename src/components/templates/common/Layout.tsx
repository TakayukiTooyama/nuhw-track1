import React, { FC, ReactNode } from 'react';
import Head from 'next/head';
import { Box, Container } from '@chakra-ui/react';

import Header from './Header';
import { useAuthentication } from '../../../hooks/useAuthentication';
import { NavBar } from '../../oraganisms';

type Props = {
  children: ReactNode;
  title: string;
  noHeader?: boolean;
  bg?: string;
};

const Layout: FC<Props> = ({
  children,
  title = 'NUHW TRACK',
  noHeader = false,
  bg = 'white',
}) => {
  const { user } = useAuthentication();
  const avatar = user?.photoURL;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {noHeader ? null : <Header avatar={avatar} />}
      <Box bg={bg}>
        <Container pt={8} pb={16} zIndex={2}>
          {children}
        </Container>
      </Box>
      <NavBar />
    </>
  );
};

export default Layout;
