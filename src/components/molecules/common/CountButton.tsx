import { Button } from '@chakra-ui/react';
import React, { VFC } from 'react';

type Props = {
  setCount: (value: React.SetStateAction<number>) => void;
  count: number;
  countLabel: number;
  label: string;
};

const CountButton: VFC<Props> = ({ setCount, count, countLabel, label }) => {
  console.log(count);

  const countFunc = () => {
    if (count < 1 && countLabel === -1) {
      setCount(0);
      return;
    }
    setCount((prev) => prev + countLabel);
  };

  return (
    <Button shadow="base" onClick={countFunc}>
      {label}
    </Button>
  );
};

export default CountButton;
