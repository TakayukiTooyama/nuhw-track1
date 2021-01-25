import {
  Editable,
  EditableInput,
  EditablePreview,
  NumberInput,
  NumberInputField,
  Stack,
  Container,
  Button,
  Input,
} from '@chakra-ui/react';
import React, { useState } from 'react';

const Test = () => {
  const [test1, setTest1] = useState('hello');
  const [test2, setTest2] = useState('');
  const [test3, setTest3] = useState('');
  const [toggleEdit, setToggleEdit] = useState(false);

  const handleChange = (
    nextValue: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setValue(nextValue);
  };

  // 入力モードへ切り替え & indexを戻す
  const InputToggle = () => {
    setToggleEdit(true);
  };

  const onBlur = () => {
    setToggleEdit(false);
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
        <NumberInput
          value={test1}
          w="100%"
          inputMode="numeric"
          onChange={(value) => handleChange(value, setTest1)}
          placeholder="mode=numeric"
        >
          <NumberInputField />
        </NumberInput>
        <NumberInput
          value={test2}
          w="100%"
          inputMode="numeric"
          onChange={(value) => handleChange(value, setTest2)}
          placeholder="mode=numeric"
        >
          <NumberInputField />
        </NumberInput>
        {toggleEdit ? (
          <NumberInput
            value={test3}
            w="100%"
            inputMode="numeric"
            onChange={(value) => handleChange(value, setTest3)}
            placeholder="mode=numeric"
            onBlur={onBlur}
          >
            <NumberInputField autoFocus />
          </NumberInput>
        ) : null}
        <Button
          ml={12}
          w="100%"
          maxW="200px"
          shadow="base"
          onClick={InputToggle}
        >
          ＋
        </Button>
        <Input type="number" placeholder="number" />
        <Input type="number" placeholder="number" />
        <Input type=" text" placeholder="text" />
        <Input type=" tel" placeholder="tel" />
      </Stack>
    </Container>
  );
};

export default Test;
