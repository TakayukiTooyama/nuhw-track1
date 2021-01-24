import { Box, Button, Heading, Image, Text } from '@chakra-ui/react';
import React, { VFC } from 'react';

import { auth, provider } from '../../../lib/firebase';

const SignInBottom: VFC = () => {
  const bottomBox = {
    h: { base: '50vh', md: '100vh' },
    w: { base: '100％', md: '100vh' },
    bg: 'blue.50',
    pt: 10,
  };

  const inner = {
    w: '80%',
    top: '50%',
    left: '50%',
    transform: 'translateY(-50%) translateX(-50%)',
  };

  const signInButton = {
    bg: 'white',
    shadow: 'base',
    mt: 5,
    mb: 7,
  };

  const login = () => {
    auth.signInWithRedirect(provider);
  };

  return (
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
        <Box mb={6} />
        <Text>
          新規登録、ログインのどちらも以下のリンクから行うことができます。利用規約、プライバシーポリシーに同意したうえでログインしてください。
        </Text>
      </Box>
    </Box>
  );
};

export default SignInBottom;
