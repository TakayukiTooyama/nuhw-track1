import { Heading, HeadingProps } from '@chakra-ui/react';
import React, { VFC } from 'react';

type Props = HeadingProps & {
  label: string;
};

const Heading1: VFC<Props> = ({ label, ...props }) => (
  <Heading size="lg" {...props}>
    {label}
  </Heading>
);

const Heading2: VFC<Props> = ({ label, ...props }) => (
  <Heading size="md" {...props}>
    {label}
  </Heading>
);

const Heading3: VFC<Props> = ({ label, ...props }) => (
  <Heading size="sm" {...props}>
    {label}
  </Heading>
);

export { Heading1, Heading2, Heading3 };
