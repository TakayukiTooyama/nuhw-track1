import {
  NumberInput,
  NumberInputField,
  NumberInputProps,
} from '@chakra-ui/react';
import React, { VFC } from 'react';

type Props = NumberInputProps & {
  value: string;
  type?: string;
  placeholder?: string;
  onChange?: (valueAsString: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

const InputNumber: VFC<Props> = ({
  value,
  type = 'number',
  placeholder,
  onChange,
  onBlur,
  onKeyDown,
  ...props
}) => (
  <NumberInput
    value={value}
    w="100%"
    maxW="255px"
    onChange={onChange}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
    {...props}
  >
    <NumberInputField autoFocus placeholder={placeholder} type={type} />
  </NumberInput>
);

export default InputNumber;
