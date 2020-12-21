import React, { VFC } from 'react';
import { Stack } from '@chakra-ui/react';
import { LinkBlock } from '../../molecules';
import { useRecoilValue } from 'recoil';
import { selectedDateIdState } from '../../../recoil/users/user';
import { AiOutlineRight } from 'react-icons/ai';
import { LinkContent } from '../../../models/users';

const Home: VFC = () => {
  //Global state
  const selectedDateId = useRecoilValue(selectedDateIdState);

  const contents: LinkContent[] = [
    {
      id: 'practice',
      name: '練習タイム',
      color: 'orange.400',
      link: selectedDateId,
    },
    { id: 'weight', name: 'ウエイト', color: 'blue.400', link: selectedDateId },
    { id: 'tournament', name: '大会結果', color: 'green.400', link: 'search' },
  ];

  return (
    <Stack spacing={4} display="flex" flexDirection="column">
      {contents.map((item) => {
        if (item.id === 'tournament') {
          return (
            <LinkBlock
              key={item.id}
              item={item}
              rightIcon={<AiOutlineRight fontSize="20px" />}
            />
          );
        }
        return (
          <LinkBlock
            key={item.id}
            item={item}
            rightIcon={<AiOutlineRight fontSize="20px" />}
          />
        );
      })}
    </Stack>
  );
};

export default Home;
