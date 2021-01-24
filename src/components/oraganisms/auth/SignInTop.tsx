import { Box, Heading, Text } from '@chakra-ui/react';
import React, { VFC } from 'react';

const SignInTop: VFC = () => {
  const topBox = {
    h: { base: '50vh', md: '100vh' },
    w: { base: '100％', md: '100vh' },
    pt: 10,
    align: 'center',
  };

  const inner = {
    w: '80%',
    top: '50%',
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

  return (
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
  );
};

export default SignInTop;
