import {
  Input,
  InputGroup as Group,
  InputRightElement,
} from '@chakra-ui/react';
import React, { VFC } from 'react';

type Props = {
  value: string | number;
  isReadOnly: boolean;
  label?: string;
  width?: string;
  maxW?: string;
};

const InputGroup: VFC<Props> = ({
  value,
  isReadOnly,
  label,
  width = '100%',
  maxW = '300px',
}) => (
    <Group bg="white" w={width} maxW={maxW}>
      <Input value={value} isReadOnly={isReadOnly} textAlign="center" />
      <InputRightElement children={label} />
    </Group>
  );

export default InputGroup;
