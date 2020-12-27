import { Stack } from '@chakra-ui/react';
import React, { VFC } from 'react';
import { LinkContent } from '../../../models/users';
import { LinkBlock } from '../../molecules';

type Props = {};

const content: LinkContent[] = [
  {
    id: 'view',
    name: 'ウエイト記録一覧',
    color: 'blue.400',
    link: 'weight',
  },
  {
    id: 'view',
    name: '大会結果一覧',
    color: 'green.400',
    link: 'tournament',
  },
];

const ViewDetail: VFC<Props> = () => {
  return (
    <Stack spacing={4}>
      {content.map((item) => (
        <LinkBlock key={item.name} item={item} />
      ))}
    </Stack>
  );
};

export default ViewDetail;
