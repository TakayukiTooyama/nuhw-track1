import React, { useState, VFC } from 'react';
import { Box, Divider, IconButton, Img, Stack, Text } from '@chakra-ui/react';
import { userState } from '../../../recoil/users/user';
import { useRecoilState } from 'recoil';
import { ProfileEdit } from '..';
import { CloseIcon, EditIcon } from '@chakra-ui/icons';

const ProfileDetail: VFC = () => {
  const [user, setUser] = useRecoilState(userState);
  const [toggleEdit, setToggleEdit] = useState(false);

  return (
    <Box pos="relative">
      <IconButton
        pos="absolute"
        top="0px"
        right="0px"
        shadow="base"
        aria-label="profile-edit"
        onClick={() => setToggleEdit((prev) => !prev)}
      >
        {toggleEdit ? <CloseIcon /> : <EditIcon />}
      </IconButton>
      {user ? (
        toggleEdit ? (
          <ProfileEdit
            user={user}
            setUser={setUser}
            setToggleEdit={setToggleEdit}
          />
        ) : (
          <Box direction="column" align="center">
            <Img
              borderRadius="full"
              boxSize="150px"
              boxShadow="base"
              alt={user.displayName}
              src={user.photoURL}
            />
            <Box mb={4} />
            <Stack spacing={6}>
              <Divider />
              <Text>{user.displayName}</Text>
              <Divider />
              <Text>{user.grade}</Text>
              <Divider />
              <Text>{user.blockName}</Text>
              <Divider />
            </Stack>
          </Box>
        )
      ) : null}
    </Box>
  );
};

export default ProfileDetail;
