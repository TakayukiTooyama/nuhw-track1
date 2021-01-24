import { Input } from '@chakra-ui/react';
import React, { ChangeEvent, VFC } from 'react';

type Props = {
  autoFocus?: boolean;
  value: string | number;
  placeholder?: string;
  isReadOnly?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  maxW?: string;
  textAlign?: 'left' | 'center' | 'right';
};

const InputText: VFC<Props> = ({
  autoFocus = false,
  placeholder,
  isReadOnly = false,
  value,
  onChange,
  maxW = '350px',
  textAlign = 'left',
}) => (
    <Input
      autoFocus={autoFocus}
      placeholder={placeholder}
      bg="white"
      isReadOnly={isReadOnly}
      value={value}
      onChange={onChange}
      w="100%"
      maxW={maxW}
      textAlign={textAlign}
    />
  );

export default InputText;
