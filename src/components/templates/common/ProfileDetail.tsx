import React, { FC, useEffect } from 'react';
import { Box, Divider, Image, Stack, Text } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { userAuthState, userState } from '../../../recoil/users/user';
import { db } from '../../../lib/firebase';
import { User } from '../../../models/users';

const ProfileDetail: FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const userAuth = useRecoilValue(userAuthState);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userAuth === null) return;
      await db
        .collection('users')
        .doc(userAuth.uid)
        .get()
        .then((doc) => {
          const data = doc.data() as User;
          setUser(data);
        });
    };
    fetchUserInfo();
  }, [userAuth]);

  return (
    <Box direction="column" align="center">
      <Image
        borderRadius="full"
        boxSize="150px"
        alt={userAuth?.displayName}
        src={userAuth?.photoURL}
      />
      <Box mb={4}></Box>
      <Stack spacing={6}>
        <Text fontSize="2xl">{userAuth?.displayName}</Text>
        <Divider />
        <Text>{user?.teamInfo.teamName}</Text>
        <Text>{user?.grade}</Text>
        <Text>{user?.blockName}</Text>
      </Stack>
    </Box>
  );
};

export default ProfileDetail;
