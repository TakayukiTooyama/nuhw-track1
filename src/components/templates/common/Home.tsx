import { Stack } from '@chakra-ui/react';
import React, { VFC } from 'react';
import { useRecoilValue } from 'recoil';

import { LinkContent } from '../../../models/users';
import { selectedDateIdState } from '../../../recoil/users/user';
import { ImageLinkButton } from '../../molecules';

const Home: VFC = () => {
  // Global state
  const selectedDateId = useRecoilValue(selectedDateIdState);

  const contents: LinkContent[] = [
    {
      id: 'practice',
      name: '練習タイム',
      link: selectedDateId,
      image: '/orange-track.jpg',
    },
    {
      id: 'weight',
      name: 'ウエイト',
      link: selectedDateId,
      image: '/running.jpg',
    },
    {
      id: 'tournament',
      name: '大会結果',
      link: 'search',
      image: '/blue-track.jpg',
    },
  ];

  return (
    <Stack spacing={4} display="flex" flexDirection="column">
      {contents.map((item) => {
        if (item.id === 'tournament') {
          return <ImageLinkButton key={item.id} item={item} />;
        }
        return <ImageLinkButton key={item.id} item={item} />;
      })}
    </Stack>
  );
};

export default Home;
