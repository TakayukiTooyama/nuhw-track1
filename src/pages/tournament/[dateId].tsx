import React from 'react';
import { NextPage } from 'next';
import { Stack } from '@chakra-ui/react';

import { Layout } from '../../components/templates';

const Tournament: NextPage = () => {
  return (
    <Layout title="大会結果" bg="green.50">
      <Stack spacing={8}></Stack>
    </Layout>
  );
};

export default Tournament;
