import { Stack } from '@chakra-ui/react';
import React from 'react';
import Test from '../../components/oraganisms/Test';
import Layout from '../../components/templates/Layout';

const Result = () => {
  return (
    <Layout title="大会結果" bg="green.50">
      <Stack spacing={8}>
        <Test />
        <Test />
        <Test />
      </Stack>
    </Layout>
  );
};

export default Result;
