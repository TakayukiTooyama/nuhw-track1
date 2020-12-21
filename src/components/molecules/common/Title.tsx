import { Box, Heading } from '@chakra-ui/react';
import React, { FC } from 'react';

type Props = {
  title: string;
};

const Title: FC<Props> = ({ title }) => {
  return (
    <Box p="40px" color="white" bg="black" shadow="md">
      <Heading>{title}</Heading>
    </Box>
  );
};

export default Title;
