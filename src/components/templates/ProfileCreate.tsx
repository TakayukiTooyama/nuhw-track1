import React, { FC, useState } from 'react';
import { Box, Stack } from '@chakra-ui/react';

import { FormButton, SelectRadio } from '../molecules';
import SelectMenu from '../molecules/SelectMenu';

//Radio & Selectの内容
const gradeContents = ['1年', '2年', '3年', '4年'];
const blocks = ['短距離ブロック', 'ミドルブロック'];
const genderContents = ['男', '女'];

type Props = {
  addUserInfo: (
    blockName: string,
    gender: string,
    grade: string
  ) => Promise<void>;
  isLoading: boolean;
};

const ProfileCreate: FC<Props> = ({ addUserInfo, isLoading = false }) => {
  const [gender, setGender] = useState('男'),
    [grade, setGrade] = useState('1年'),
    [blockName, setBlockName] = useState('ミドルブロック');

  return (
    <>
      <SelectMenu label={blockName} contents={blocks} setName={setBlockName} />
      <Box mb={10}></Box>
      <Stack spacing={4}>
        <SelectRadio
          value={grade}
          setValue={setGrade}
          contents={gradeContents}
        />
        <SelectRadio
          value={gender}
          contents={genderContents}
          setValue={setGender}
        />
      </Stack>
      <Box mb={10}></Box>
      <FormButton
        label="作成"
        bg="blue.400"
        onClick={() => addUserInfo(blockName, grade, gender)}
        isLoading={isLoading}
      >
        作成
      </FormButton>
    </>
  );
};

export default ProfileCreate;
