import { Button, ButtonProps } from '@chakra-ui/react';
import Link from 'next/link';
import React, { VFC } from 'react';

type Props = ButtonProps & {
  link: string;
  label: string;
};

const LinkButton: VFC<Props> = ({ link, label, ...props }) => (
  <Link href={link} passHref>
    <Button
      bg="gray.100"
      border="2px solid"
      borderColor="gray.300"
      borderRadius="30px"
      {...props}
    >
      {label}
    </Button>
  </Link>
);

export default LinkButton;
