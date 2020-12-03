import React, { FC } from 'react';
import Router from 'next/router';
import { useRecoilValue } from 'recoil';
import { Button, Flex, Text } from '@chakra-ui/react';
import { AiOutlineRight } from 'react-icons/ai';

import { selectedDateIdState } from '../../../recoil/users/user';

const contents = [
  { id: 'practice', name: '練習タイム', color: 'orange.400' },
  { id: 'weight', name: 'ウエイト', color: 'blue.400' },
  { id: 'tournament', name: '大会結果', color: 'green.400' },
];

const buttonStyles = {
  boxShadow: 'base',
  w: '100%',
  h: 200,
  mb: 3,
  color: 'white',
};

const Home: FC = () => {
  const selectedDateId = useRecoilValue(selectedDateIdState);

  const goToItemPage = (link: string) => {
    Router.push(link);
  };

  return (
    <>
      <Flex direction="column">
        {contents.map((item) => (
          <Button
            key={item.id}
            {...buttonStyles}
            bg={item.color}
            rightIcon={<AiOutlineRight />}
            onClick={() => goToItemPage(`/${item.id}/${selectedDateId}`)}
          >
            <Text fontSize="2xl">{item.name}</Text>
          </Button>
        ))}
      </Flex>
    </>
  );
};

export default Home;
