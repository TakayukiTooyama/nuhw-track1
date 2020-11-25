import React, { FC } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Progress,
  Text,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { loadingState } from '../../recoil/user';

type Props = {
  login: () => void;
};

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

const SignIn: FC<Props> = ({ login = () => undefined }) => {
  const loading = useRecoilValue(loadingState);
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
