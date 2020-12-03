import React, { FC, ReactNode } from 'react';
import Head from 'next/head';
import { Box, Container } from '@chakra-ui/react';

import Header from './Header';
import { useAuthentication } from '../../../hooks/useAuthentication';

type Props = {
  children: ReactNode;
  title: string;
  noHeader?: boolean;
  bg?: string;
};

const Layout: FC<Props> = ({
  children,
  title = '新潟医療福祉大学',
  noHeader = false,
  bg = 'white',
}) => {
  const { user } = useAuthentication();

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {noHeader ? null : <Header avatar={user?.photoURL!} />}
      <Box bg={bg}>
        <Container pt={12} pb={16} zIndex={2}>
          {children}
        </Container>
      </Box>
    </>
  );
};

export default Layout;
