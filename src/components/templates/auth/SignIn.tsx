import React, { FC, useEffect } from 'react';
import Router from 'next/router';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Progress,
  Text,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';

import { loadingState } from '../../../recoil/users/user';
import { useAuthentication } from '../../../hooks/useAuthentication';
import { auth, db, provider } from '../../../lib/firebase';
import { User, UserInfo } from '../../../models/users';

const topBox = {
  h: { base: '45vh', md: '100vh' },
  w: { base: '100％', md: '100vh' },
  pt: 10,
  align: 'center',
};

const bottomBox = {
  h: { base: '55vh', md: '100vh' },
  w: { base: '100％', md: '100vh' },
  bg: 'blue.50',
  pt: 10,
};

const inner = {
  w: '80%',
  top: '45%',
  left: '50%',
  transform: 'translateY(-50%) translateX(-50%)',
};

const textBox = {
  mt: 8,
  w: '90%',
  mx: 'auto',
  maxW: '500px',
  align: 'left',
};

const signInButton = {
  bg: 'white',
  shadow: 'base',
  mt: 5,
  mb: 7,
};

const SignIn: FC = () => {
  //Global State
  const [loading, setLoading] = useRecoilState(loadingState);

  //カスタムhook
  const { userAuth } = useAuthentication();

  const fetchTeamInfo = async (uid: string) => {
    const usersRef = db.collection('users');
    await usersRef
      .doc(uid)
      .get()
      .then((doc) => {
        const data = doc.data() as UserInfo;
        if (data && data.teamInfo) {
          Router.push('/');
        } else {
          Router.push('/teams/join');
        }
      });
  };
  const transition = async () => {
    const userRef = db.collection('users').doc(userAuth?.uid);
    await userRef.get().then((doc) => {
      const data = doc.data() as User;
      if (!data) Router.push('teams/join');
      if (data && !data.blockName) Router.push('/teams/profile');
      if (data && data.teamInfo && data.blockName) Router.push('/');
    });
  };

  useEffect(() => {
    auth.getRedirectResult().then((result) => {
      if (result.user || auth.currentUser) {
        if (result.user !== null) {
          fetchTeamInfo(result.user.uid);
        }
      } else {
        setLoading(true);
      }
    });
  }, [userAuth]);

  useEffect(() => {
    if (userAuth !== null) {
      transition();
    }
  }, [userAuth]);

  const login = () => {
    auth.signInWithRedirect(provider);
  };

  return (
    <>
      {loading ? (
        <Flex direction={{ base: 'column', md: 'row' }}>
          <Box {...topBox} pos="relative">
            <Box {...inner} pos="absolute">
              <Heading size="xl" textShadow="1px 1px #ddd">
                Continuation is power.
              </Heading>
              <Text as="sub" fontSize="14px">
                〜 継続は力なり 〜
              </Text>
              <Box {...textBox}>
                <Text color="grey.200">
                  スポーツをする上で高い意識・熱量を維持し続けることはとても重要である。しかし、多くの人は「継続」することができない。CIPを使うことで一人でも多くの方の競技力が向上することを願っている。
                </Text>
              </Box>
            </Box>
          </Box>
          <Box {...bottomBox} pos="relative">
            <Box {...inner} pos="absolute">
              <Heading size="2xl">Sign In</Heading>
              <Button {...signInButton} onClick={login}>
                <Image
                  src="/icon-google.svg"
                  alt="google-icon"
                  w="24px"
                  h="24px"
                  mr={2}
                />
                Sign in with Google
              </Button>
              <Box mb={6}></Box>
              <Text>
                新規登録、ログインのどちらも以下のリンクから行うことができます。利用規約、プライバシーポリシーに同意したうえでログインしてください。
              </Text>
            </Box>
          </Box>
        </Flex>
      ) : (
        <Progress size="xs" isIndeterminate />
      )}
    </>
  );
};

export default SignIn;
