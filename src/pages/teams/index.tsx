import React, { useCallback } from 'react';
import Router from 'next/router';
import { Button, Text } from '@chakra-ui/react';
import { FaSchool } from 'react-icons/fa';
import { AiOutlineUserAdd } from 'react-icons/ai';

import { Layout } from '../../components/templates';
import { Title } from '../../components/molecules';

const Teams = () => {
  const goToRoute = useCallback((route: string) => {
    Router.push(route);
  }, []);

  const button = {
    w: '100%',
    maxW: 500,
    h: 100,
    mx: 'auto',
    mb: 4,
    color: 'white',
    boxShadow: 'base',
    fontSize: 30,
  };

  const text = {
    fontSize: '20px',
    textShadow: '1px 1px grey',
    ml: 2,
  };

  return (
    <>
      <Title title="団体" />
      <Layout title="団体" noHeader={true}>
        <Button
          {...button}
          bg="orange.400"
          leftIcon={<FaSchool />}
          onClick={() => goToRoute('/teams/create')}
        >
          <Text {...text}>団体作成</Text>
        </Button>
        <Button
          {...button}
          bg="blue.400"
          leftIcon={<AiOutlineUserAdd />}
          onClick={() => goToRoute('/teams/join')}
        >
          <Text {...text}>団体参加</Text>
        </Button>
      </Layout>
    </>
  );
};

export default Teams;
