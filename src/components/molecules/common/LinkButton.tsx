import { Button } from '@chakra-ui/react';
import Link from 'next/link';
import React, { VFC } from 'react';

type Props = {
  link: string;
  label: string;
};

const LinkButton: VFC<Props> = ({ link, label }) => (
    <Link href={link} passHref>
      <Button shadow="base">{label}</Button>
    </Link>
  );

export default LinkButton;
