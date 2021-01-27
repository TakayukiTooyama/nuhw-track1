import { Input, NumberInputProps } from '@chakra-ui/react';
import React, { MouseEvent, VFC } from 'react';

type Props = NumberInputProps & {
  defaultValue: string;
  maxW?: string;
  onClick: (e: MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const InputNumberReadonly: VFC<Props> = (props) => {
  const { defaultValue, maxW = '200px', onClick } = props;
  return (
    <Input
      isReadOnly
      defaultValue={defaultValue}
      w="100%"
      maxW={maxW}
      onClick={onClick}
    />
  );
};

export default InputNumberReadonly;
