import React, { FC, ReactNode } from 'react';
import Head from 'next/head';
import { Container } from '@chakra-ui/react';

import Header from './Header';
import { NavBar } from '../../oraganisms';

type Props = {
  children: ReactNode;
  title: string;
  noHeader?: boolean;
};

const Layout: FC<Props> = ({
  children,
  title = 'NUHW TRACK',
  noHeader = false,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {noHeader ? null : <Header />}
      <Container pt={8} pb={16} zIndex={2}>
        {children}
      </Container>
      <NavBar />
    </>
  );
};

export default Layout;
