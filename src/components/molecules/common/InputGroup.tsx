import {
  Input,
  InputGroup as Group,
  InputRightElement,
} from '@chakra-ui/react';
import React, { VFC } from 'react';

type Props = {
  value: string | number;
  isReadOnly: boolean;
  label: string;
};

const InputGroup: VFC<Props> = ({ value, isReadOnly, label }) => {
  return (
    <Group bg="white" borderRadius="5px" w="100%" maxW="300px">
      <Input value={value} isReadOnly={isReadOnly} textAlign="center" />
      <InputRightElement children={label} />
    </Group>
  );
};

export default InputGroup;
