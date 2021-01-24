import { Box, Stack } from '@chakra-ui/react';
import React, { FC, useState } from 'react';

import { useAuthentication } from '../../../hooks';
import { addProfileInfo } from '../../../lib/firestore/users';
import SelectMenu from '../../molecules/common/SelectMenu1';
import { FormButton, SelectRadio } from '../../molecules/index';

const ProfileCreate: FC = () => {
  const [gender, setGender] = useState('男');
  const [grade, setGrade] = useState('1年');
  const [blockName, setBlockName] = useState('ミドルブロック');
  const [isLoading, setIsLoading] = useState(false);

  const { userAuth } = useAuthentication();

  // Radio & Selectの内容
  const gradeContents = ['1年', '2年', '3年', '4年'];
  const blocks = ['短距離ブロック', 'ミドルブロック'];
  const genderContents = ['男', '女'];

  return (
    <>
      <SelectMenu label={blockName} contents={blocks} setName={setBlockName} />
      <Box mb={10} />
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
      <Box mb={10} />
      <FormButton
        label="作成"
        bg="blue.400"
        onClick={() =>
          addProfileInfo(blockName, grade, gender, userAuth, setIsLoading)
        }
        isLoading={isLoading}
      >
        作成
      </FormButton>
    </>
  );
};

export default ProfileCreate;
