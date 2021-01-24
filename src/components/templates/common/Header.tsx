import { Box, Divider, Heading } from '@chakra-ui/react';
import Link from 'next/link';
import React, { useEffect, VFC } from 'react';
import { useRecoilState } from 'recoil';

import { useAuthentication } from '../../../hooks';
import { fetchUserInfo } from '../../../lib/firestore/users';
import { userState } from '../../../recoil/users/user';
import GuideMenu from '../../oraganisms/common/GuideMenu';

const Header: VFC = () => {
  const [user, setUser] = useRecoilState(userState);
  const { userAuth } = useAuthentication();

  // 最初にユーザー情報がGlobalStateに入っているか確認
  useEffect(() => {
    if (user || !userAuth) return;
    fetchUserInfo(userAuth, setUser);
  }, [userAuth, setUser, user]);

  return (
    <>
      <Box color="grey" py={2} px={4}>
        <Box
          maxW="6xl"
          mx="auto"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Link href="/">
            <Heading as="h1" size="md">
              NUHW TRACK
            </Heading>
          </Link>
          <GuideMenu />
        </Box>
      </Box>
      <Divider />
    </>
  );
};

export default Header;
