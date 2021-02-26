import { Box, BoxProps } from '@chakra-ui/react';
import React, { VFC } from 'react';

type Props = BoxProps & {
  value: string;
  borderstyle?: string;
};

const BoxStyle = {
  w: '100%',
  fontSize: '1rem',
  px: 4,
  h: 10,
  lineHeight: 10,
};

const InputBox: VFC<Props> = (props) => {
  const {
    value,
    maxW = '255px',
    borderRadius = '0.375rem',
    textAlign = 'left',
    borderstyle = '',
  } = props;
  const border =
    borderstyle === 'none'
      ? { border: 'none' }
      : { border: '1px solid', borderColor: 'inherit' };
  return (
    <Box
      {...BoxStyle}
      {...border}
      maxW={maxW}
      borderRadius={borderRadius}
      align={textAlign}
      {...props}
    >
      {value}
    </Box>
  );
};

export default InputBox;
