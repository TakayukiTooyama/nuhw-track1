import { Heading } from '@chakra-ui/react';
import React, { VFC } from 'react';

type Props = {
  label: string;
};

const Heading1: VFC<Props> = ({ label }) => {
  return <Heading size="lg">{label}</Heading>;
};

const Heading2: VFC<Props> = ({ label }) => {
  return <Heading size="md">{label}</Heading>;
};

const Heading3: VFC<Props> = ({ label }) => {
  return <Heading size="sm">{label}</Heading>;
};

export { Heading1, Heading2, Heading3 };
