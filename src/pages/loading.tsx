import React, { useEffect } from 'react';
import Router from 'next/router';
import { useAuthentication } from '../hooks/useAuthentication';
import { Center, Text } from '@chakra-ui/react';

const Loading = () => {
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
