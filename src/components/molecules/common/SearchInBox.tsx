import { Box, Divider, Spinner, Stack, Text } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, VFC } from 'react';

type Props = {
  nameList?: string[];
  setName: Dispatch<SetStateAction<string>>;
};

const SearchInBox: VFC<Props> = ({ nameList, setName }) => (
  <Stack w="100%" border="1px solid" borderColor="gray.200" spacing={0}>
    {nameList ? (
      nameList.map((item) => (
        <Box
          key={item}
          px={2}
          bg="white"
          textAlign="center"
          h="35px"
          lineHeight="35px"
          cursor="pointer"
          _hover={{ bg: 'gray.100' }}
          onClick={() => setName(item)}
        >
          <Text color="gray.400">{item}</Text>
          <Divider />
        </Box>
      ))
    ) : (
      <Box p={[2, 4]} textAlign="center" color="gray.300">
        <Spinner />
      </Box>
    )}
  </Stack>
);

export default SearchInBox;
