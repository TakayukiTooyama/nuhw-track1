import { Input } from '@chakra-ui/react';
import React, { FC, useState } from 'react';

type Props = {
  id: number;
  value: string;
  setEditToggle: any;
  updateRecode: any;
};

const EditInput: FC<Props> = ({ id, value, updateRecode, setEditToggle }) => {
  const [recode, setRecode] = useState(value),
    [isComposed, setIsComposed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecode(e.target.value);
  };

  const updateRecodePressEnter = (e: React.KeyboardEvent<HTMLElement>) => {
    if (isComposed) return;
    updateRecode(e, id, recode);
  };

  return (
    <Input
      autoFocus
      w="80%"
      maxW="200px"
      value={recode}
      onChange={handleChange}
      onKeyDown={(e) => updateRecodePressEnter(e)}
      onCompositionStart={() => setIsComposed(true)}
      onCompositionEnd={() => setIsComposed(false)}
    />
  );
};

export default EditInput;
