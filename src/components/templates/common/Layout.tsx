import { Container } from '@chakra-ui/react';
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
  <>
    <Head>
      <title>{title}</title>
    </Head>
    {noHeader ? null : <Header />}
    <Container pt="32px" pb="82px" minH="clac(100vh - 110px)">
      {children}
    </Container>
    {noHeader ? null : <NavBar />}
  </>
);

export default Layout;
