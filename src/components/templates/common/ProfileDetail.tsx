import { CloseIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Divider, IconButton, Stack, Text, Image } from '@chakra-ui/react';
import React, { useState, VFC } from 'react';
import { useRecoilState } from 'recoil';

import { userState } from '../../../recoil/users/user';
import { ProfileEdit } from '../../oraganisms';

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
      {user && (
        <Box direction="column" align="center">
          <Image
            src={user.photoURL ?? '/no-profile.png'}
            width="150px"
            height="150px"
            borderRadius="full"
            alt={user.displayName}
          />
          <Box mb={4} />
          {toggleEdit ? (
            <ProfileEdit
              user={user}
              setUser={setUser}
              setToggleEdit={setToggleEdit}
            />
          ) : (
            <Stack spacing={6}>
              <Divider />
              <Text>{user.displayName}</Text>
              <Divider />
              <Text>{user.grade}</Text>
              <Divider />
              <Text>{user.blockName}</Text>
              <Divider />
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProfileDetail;
