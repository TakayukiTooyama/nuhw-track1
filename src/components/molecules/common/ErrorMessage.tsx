import { Text } from '@chakra-ui/react';
import React, { VFC } from 'react';

type Props = {
  message: string;
  textAlign?: 'right' | 'left' | 'center';
};

const ErrorMessage: VFC<Props> = ({ message, textAlign = 'left' }) => {
  return (
    <Text color="red.400" textAlign={textAlign}>
      {message}
    </Text>
  );
};

export default ErrorMessage;
