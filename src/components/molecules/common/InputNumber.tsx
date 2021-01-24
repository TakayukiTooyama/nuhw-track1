import { NumberInput, NumberInputField } from '@chakra-ui/react';
import React, { VFC } from 'react';

type Props = {
  value: string;
  placeholder?: string;
  maxW?: string;
  onChange: (valueAsString: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

const InputNumber: VFC<Props> = ({
  value,
  placeholder,
  maxW = '200px',
  onChange,
  onBlur,
  onKeyDown,
}) => (
    <NumberInput
      value={value}
      w="100%"
      maxW={maxW}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <NumberInputField autoFocus placeholder={placeholder} />
    </NumberInput>
  );

export default InputNumber;
