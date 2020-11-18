import React, { ReactNode } from 'react';
import Head from 'next/head';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'NUHW TRACK' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
    </Head>
    {/* <Header/> */}
    {children}
    {/* <Footer/> */}
  </div>
);

export default Layout;
