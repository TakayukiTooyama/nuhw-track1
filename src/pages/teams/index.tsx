import React from 'react';
import { NextPage } from 'next';
import { Stack } from '@chakra-ui/react';
import { FaSchool } from 'react-icons/fa';
import { AiOutlineUserAdd } from 'react-icons/ai';

import { LinkBlock } from '../../components/molecules';
import { Layout } from '../../components/templates';
import { LinkContent } from '../../models/users';

const Teams: NextPage = () => {
  const contents: LinkContent[] = [
    {
      id: 'teams',
      name: '団体作成',
      color: 'orange.400',
      icon: <FaSchool fontSize="25px" />,
      link: 'create',
    },
    {
      id: 'teams',
      name: '団体参加',
      color: 'blue.400',
      icon: <AiOutlineUserAdd fontSize="25px" />,
      link: 'join',
    },
  ];

  return (
    <>
      <Layout title="団体" noHeader={true}>
        <Stack spacing={4}>
          {contents.map((item) => (
            <LinkBlock key={item.name} item={item} leftIcon={item.icon} />
          ))}
        </Stack>
      </Layout>
    </>
  );
};

export default Teams;
