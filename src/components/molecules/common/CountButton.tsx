import { Button } from '@chakra-ui/react';
import React, { VFC } from 'react';

type Props = {
  setCount: (value: React.SetStateAction<number>) => void;
  count: number;
  label: string;
};

const CountButton: VFC<Props> = ({ setCount, count, label }) => {
  return (
    <Button shadow="base" onClick={() => setCount((prev) => prev + count)}>
      {label}
    </Button>
  );
};

export default CountButton;
