import React, { Dispatch, SetStateAction, VFC } from 'react';
import { PinInput as Input, PinInputField } from '@chakra-ui/react';

type Props = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
};

const PinInput: VFC<Props> = ({ value, setValue }) => {
  return (
    <Input value={value} onChange={(value) => setValue(value)}>
      <PinInputField bg="white" shadow="inner" />
    </Input>
  );
};

export default PinInput;
