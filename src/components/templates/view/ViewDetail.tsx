import { Stack } from '@chakra-ui/react';
import React, { VFC } from 'react';

import { LinkContent } from '../../../models/users';
import { ImageLinkButton } from '../../molecules';

const content: LinkContent[] = [
  {
    id: 'view',
    name: 'ウエイト記録一覧',
    link: 'weight',
    image: '/weight-training.jpg',
  },
  {
    id: 'view',
    name: '大会結果一覧',
    link: 'tournament',
    image: 'podium.jpg',
  },
];

const ViewDetail: VFC = () => (
  <Stack spacing={4}>
    {content.map((item) => (
      <ImageLinkButton key={item.name} item={item} />
    ))}
  </Stack>
);

export default ViewDetail;
