import { PinInput as Input, PinInputField } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, VFC } from 'react';

type Props = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
};

const PinInput: VFC<Props> = ({ value, setValue }) => (
    <Input value={value} onChange={(value) => setValue(value)}>
      <PinInputField bg="white" shadow="inner" />
    </Input>
  );

export default PinInput;
