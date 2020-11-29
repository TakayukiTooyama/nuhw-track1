import React from 'react';
import { BoxProps, Box } from '@chakra-ui/react';

export function Table(props: BoxProps) {
  return (
    <Box shadow="base" rounded="lg" overflowX="scroll" whiteSpace="nowrap">
      <Box as="table" width="full" {...props} />
    </Box>
  );
}

export function TableHead(props: BoxProps) {
  return <Box as="thead" {...props} />;
}

export function TableRow(props: BoxProps) {
  return <Box as="tr" {...props} />;
}

export function TableHeader(props: BoxProps) {
  return (
    <Box
      as="th"
      px="6"
      py="3"
      borderBottomWidth="1px"
      backgroundColor="gray.50"
      textAlign="left"
      fontSize="xs"
      color="gray.500"
      textTransform="uppercase"
      letterSpacing="wider"
      lineHeight="1rem"
      fontWeight="medium"
      {...props}
    />
  );
}

export function TableBody(props: BoxProps) {
  return <Box as="tbody" bg="white" {...props} />;
}

export function TableCell(props: BoxProps) {
  return (
    <Box
      as="td"
      px="6"
      py="4"
      lineHeight="1.25rem"
      whiteSpace="nowrap"
      {...props}
    />
  );
}
