import React, { FC, useEffect } from 'react';
import Link from 'next/link';
import { Box, Divider, Heading } from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';

import GuideMenu from '../../oraganisms/common/GuideMenu';
import { userAuthState, userInfoState } from '../../../recoil/users/user';
import { UserInfo } from '../../../models/users';
import { db } from '../../../lib/firebase';

type Props = {
  avatar?: string;
};

const Header: FC<Props> = ({ avatar = '/no-profile.png' }) => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const user = useRecoilValue(userAuthState);

  //最初にユーザー情報がGlobalStateに入っているか確認
  useEffect(() => {
    if (userInfo) return;
    fetchUserInfo();
  }, [user]);

  //ユーザーの情報を取得
  const fetchUserInfo = async () => {
    if (user === null) return;
    const usersRef = db.collection('users').doc(user.uid);
    await usersRef.get().then((doc) => {
      const data = doc.data() as UserInfo;
      setUserInfo(data);
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
          <GuideMenu avatar={avatar} />
        </Box>
      </Box>
      <Divider />
    </>
  );
};

export default Header;