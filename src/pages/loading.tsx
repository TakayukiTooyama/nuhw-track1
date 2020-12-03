import React, { useEffect } from 'react';
import Router from 'next/router';
import { Center, Text } from '@chakra-ui/react';

import { useAuthentication } from '../hooks/useAuthentication';
import { NextPage } from 'next';

const Loading: NextPage = () => {
  const { user } = useAuthentication();

  useEffect(() => {
    user && Router.push('/');
  }, [user]);

  return (
    <Center h="100vh">
      <Text size="3xl">ようこそ新潟医療福祉大学陸上部へ</Text>
    </Center>
  );
};

export default Loading;
