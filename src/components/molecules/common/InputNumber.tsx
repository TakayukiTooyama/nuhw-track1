import {
  NumberInput,
  NumberInputField,
  NumberInputProps,
} from '@chakra-ui/react';
import React, { VFC } from 'react';

type Props = NumberInputProps & {
  value: string;
  placeholder?: string;
  maxW?: string;
  onChange?: (valueAsString: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

const InputNumber: VFC<Props> = (props) => {
  const {
    value,
    placeholder,
    maxW = '200px',
    inputMode = 'none',
    onChange,
    onBlur,
    onKeyDown,
  } = props;
  return (
    <NumberInput
      value={value}
      w="100%"
      maxW={maxW}
      type="number"
      inputMode={inputMode}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <NumberInputField autoFocus placeholder={placeholder} />
    </NumberInput>
  );
};

export default InputNumber;
