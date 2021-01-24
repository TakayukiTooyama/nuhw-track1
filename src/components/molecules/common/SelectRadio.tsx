import { Radio, RadioGroup, Stack } from '@chakra-ui/react';
import React, { FC } from 'react';

type Props = {
  value: string;
  contents: string[];
  setValue: React.Dispatch<React.SetStateAction<any>>;
};

const SelectRadio: FC<Props> = ({ value, setValue, contents }) => (
    <RadioGroup onChange={setValue} value={value}>
      <Stack direction="row">
        {contents.map((item) => (
          <Radio key={item} value={item}>
            {item}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  );

export default SelectRadio;
