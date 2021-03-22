import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import Router from 'next/router';
import React, { useState, VFC } from 'react';
import { SignInTop } from '../components/oraganisms';
import { auth, db } from '../lib/firebase';
import { User } from '../models/users';

const Demo: VFC = () => {
  const [loading, setLoading] = useState(false);
  const inner = {
    w: '70%',
    top: '50%',
    left: '50%',
    transform: 'translateY(-50%) translateX(-50%)',
  };

  const signInButton = {
    w: '100%',
    shadow: 'base',
    borderRadius: '30px',
    bg: 'white',
    mt: 5,
    mb: 7,
  };
  const bottomBox = {
    color: 'black',
    h: { base: '50vh', md: '100vh' },
    w: { base: '100％', md: '100vh' },
    bg: 'blue.50',
    pt: 10,
  };

  const singIn = async () => {
    setLoading(true);
    auth.signInAnonymously().then(async (res) => {
      if (res.user) {
        const usersRef = db.collection('users');
        const userData: Omit<User, 'tournamentIds'> = {
          uid: res.user.uid,
          displayName: 'デモ太朗',
          photoURL: '/no-profile.png',
          blockName: '短距離',
          grade: '3年',
          gender: '男',
          teamInfo: {
            teamId: 'ezopVoUOsuhOn92fJATg',
            teamName: 'デモ大学',
          },
        };
        await usersRef
          .doc(userData.uid)
          .set(userData)
          .then(() => {
            Router.push('/');
          });
      }
    });
  };

  return (
    <Flex direction={{ base: 'column', md: 'row' }}>
      <SignInTop />
      <Box {...bottomBox} pos="relative">
        <Box {...inner} pos="absolute">
          <Heading size="xl">Sign In</Heading>
          <Button {...signInButton} onClick={singIn} isLoading={loading}>
            こちらをクリック
          </Button>
          <Text>
            こちらはDemoとなるため匿名認証となります。また、チーム登録、プロフィール登録は省略されます。
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default Demo;
