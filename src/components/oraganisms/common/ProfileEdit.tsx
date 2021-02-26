import { Box, Button, Img, Stack } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, useState, VFC } from 'react';
import { SetterOrUpdater } from 'recoil';

import { db } from '../../../lib/firebase';
import { User } from '../../../models/users';
import { InputText } from '../../molecules';
import SelectMenu from '../../molecules/common/SelectMenu1';

type Props = {
  user: User;
  setUser: SetterOrUpdater<User | null>;
  setToggleEdit: Dispatch<SetStateAction<boolean>>;
};

const ProfileEdit: VFC<Props> = ({ user, setUser, setToggleEdit }) => {
  const [name, setName] = useState(user.displayName);
  const [grade, setGrade] = useState(user.grade);
  const [blockName, setBlockName] = useState(user.blockName);

  const gradeContents = ['1年', '2年', '3年', '4年'];
  const blocks = ['短距離ブロック', 'ミドルブロック'];

  const saveProfile = async () => {
    const newData: User = {
      ...user,
      displayName: name,
      grade,
      blockName,
    };
    const usersRef = db.collection('users');
    await usersRef
      .doc(user.uid)
      .update(newData)
      .then(() => {
        setUser(newData);
        setToggleEdit(false);
      });
  };

  return (
    <Box direction="column" align="center">
      <Img
        borderRadius="full"
        boxSize="150px"
        boxShadow="base"
        alt={user.displayName}
        src={user.photoURL}
      />
      <Box mb={4} />
      <Stack spacing={6} maxW="350px" mx="auto">
        <InputText
          value={name}
          textAlign="center"
          onChange={(e) => setName(e.target.value)}
        />
        <SelectMenu label={grade} contents={gradeContents} setName={setGrade} />
        <SelectMenu
          label={blockName}
          contents={blocks}
          setName={setBlockName}
        />
        <Button shadow="base" colorScheme="cyan" onClick={saveProfile}>
          保存
        </Button>
      </Stack>
    </Box>
  );
};

export default ProfileEdit;
