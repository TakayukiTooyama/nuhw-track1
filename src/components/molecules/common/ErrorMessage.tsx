import { Text } from '@chakra-ui/react';
import React, { VFC } from 'react';

type Props = {
  message: string;
};

const ErrorMessage: VFC<Props> = ({ message }) => {
  return <Text color="red.400">{message}</Text>;
};

export default ErrorMessage;
