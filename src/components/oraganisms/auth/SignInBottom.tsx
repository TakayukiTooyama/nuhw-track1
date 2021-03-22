import { Box, Button, Heading, Image } from '@chakra-ui/react';
import React, { VFC } from 'react';

import { auth, provider } from '../../../lib/firebase';

const SignInBottom: VFC = () => {
  const bottomBox = {
    h: { base: '40vh', md: '100vh' },
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
    w: '100%',
    bg: 'white',
    shadow: 'base',
    borderRadius: '30px',
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
        <Button {...signInButton} onClick={login} size="lg">
          <Image
            src="/icon-google.svg"
            alt="google-icon"
            w="24px"
            h="24px"
            mr={2}
          />
          Sign in with Google
        </Button>
      </Box>
    </Box>
  );
};

export default SignInBottom;
