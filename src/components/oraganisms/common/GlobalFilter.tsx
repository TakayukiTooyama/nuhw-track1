import { Box, Flex, Text } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, VFC } from 'react';
import { InputText } from '../../molecules';

type Props = {
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
};

const GlobalFilter: VFC<Props> = ({ filter, setFilter }) => {
  return (
    <Flex align="center">
      <Text>検索:</Text>
      <Box mr={1} />
      <InputText
        value={filter || ''}
        onChange={(e) => setFilter(e.target.value)}
      />
    </Flex>
  );
};

export default GlobalFilter;
