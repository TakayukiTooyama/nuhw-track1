import React, { useEffect, VFC } from 'react';
import Link from 'next/link';
import { Box, Divider, Heading } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';

import GuideMenu from '../../oraganisms/common/GuideMenu';
import { userState } from '../../../recoil/users/user';
import { User } from '../../../models/users';
import { db } from '../../../lib/firebase';
import { useAuthentication } from '../../../hooks/useAuthentication';

const Header: VFC = () => {
  const [user, setUser] = useRecoilState(userState);
  const { userAuth } = useAuthentication();

  //最初にユーザー情報がGlobalStateに入っているか確認
  useEffect(() => {
    if (user) return;
    fetchUserInfo();
  }, [userAuth]);

  //ユーザーの情報を取得
  const fetchUserInfo = async () => {
    if (userAuth === null) return;
    const usersRef = db.collection('users').doc(userAuth.uid);
    await usersRef.get().then((doc) => {
      const data = doc.data() as User;
      setUser(data);
    });
  };

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
