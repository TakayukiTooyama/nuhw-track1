import { Button } from '@chakra-ui/react';
import Link from 'next/link';
import React, { ReactElement, VFC } from 'react';

import { LinkContent } from '../../../models/users';

type Props = {
  item: LinkContent;
  rightIcon?: ReactElement;
  leftIcon?: ReactElement;
};

const buttonStyles = {
  boxShadow: 'base',
  w: '100%',
  h: 200,
  color: 'white',
  fontSize: '25px',
};

const LinkBlock: VFC<Props> = ({ item, leftIcon, rightIcon }) => (
    <Link href={`/${item.id}/${item.link}`} passHref>
      <Button
        {...buttonStyles}
        bg={item.color}
        rightIcon={rightIcon}
        leftIcon={leftIcon}
      >
        {item.name}
      </Button>
    </Link>
  );

export default LinkBlock;
