import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import React, { ChangeEvent, KeyboardEvent, VFC } from 'react';
import { useSetRecoilState } from 'recoil';
import { isComposedState } from '../../../recoil/users/user';

type Props = {
  value: string;
  placeholder: string;
  unit?: string;
  addFunc?: (e: KeyboardEvent<HTMLElement>) => Promise<void>;
  handleBlur?: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const InputKeyDown: VFC<Props> = ({
  value,
  placeholder,
  unit,
  addFunc,
  handleBlur,
  handleChange,
}) => {
  const setIsComposed = useSetRecoilState(isComposedState);
  return (
    <InputGroup maxW="255px">
      <Input
        autoFocus
        bg="white"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={addFunc}
        onCompositionStart={() => setIsComposed(true)}
        onCompositionEnd={() => setIsComposed(false)}
        onBlur={handleBlur}
      />
      <InputRightElement children={unit} />
    </InputGroup>
  );
};

export default InputKeyDown;
