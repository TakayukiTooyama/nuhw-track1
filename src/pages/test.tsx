import {
  Editable,
  EditableInput,
  EditablePreview,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  Container,
} from '@chakra-ui/react';
import React, { useState } from 'react';

const Test = () => {
  const [test1, setTest1] = useState('hello');
  const [test2, setTest2] = useState('');
  const [test3, setTest3] = useState('');

  const handleChange = (
    nextValue: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setValue(nextValue);
  };

  return (
    <Container py={8}>
      <Stack>
        <Editable
          // selectAllOnFocus={false}
          onChange={(value) => {
            handleChange(value, setTest1), console.log('change');
          }}
          onEdit={() => console.log('onedit')}
          onSubmit={() => console.log('submit')}
          onCancel={() => console.log('cancel')}
          value={test1}
        >
          <EditablePreview px={4} py={2} w="100%" border="1px solid black" />
          <EditableInput px={4} py={2} />
        </Editable>
        <Input type="number" placeholder="type=number" />
        <Input
          type="number"
          inputMode="decimal"
          placeholder="type=number,mode=decimal"
        />
        <NumberInput
          value={test2}
          w="100%"
          inputMode="text"
          onChange={(value) => handleChange(value, setTest2)}
          placeholder="mode=text"
        >
          <NumberInputField />
        </NumberInput>
        <NumberInput
          value={test3}
          w="100%"
          inputMode="numeric"
          onChange={(value) => handleChange(value, setTest3)}
          placeholder="mode=numeric"
        >
          <NumberInputField />
        </NumberInput>
      </Stack>
    </Container>
  );
};

export default Test;
