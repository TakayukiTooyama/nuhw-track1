import {
  Box,
  Divider,
  Flex,
  HStack,
  Icon,
  Spacer,
  Text,
} from '@chakra-ui/react';
import React, { VFC } from 'react';
import { useScreenHeight } from '../../../hooks';
import { TiDelete } from 'react-icons/ti';
import { GrEdit } from 'react-icons/gr';
import { Record } from '../../../models/users';
import { IconType } from 'react-icons/lib';

type Props = {
  name: string;
  label: string;
  nameIcon: IconType;
  labelIcon: IconType;
  recodes: Record[];
  deleteRecord: (index: number) => Promise<void>;
  formatValue: (input: string) => string;
};

const ModalDisplayRecord: VFC<Props> = ({
  name,
  label,
  nameIcon,
  labelIcon,
  recodes,
  deleteRecord,
  formatValue,
}) => {
  const { screenHeight } = useScreenHeight();

  return (
    <Box maxW="400px" mx="auto">
      <Box
        px={4}
        py={2}
        w="100%"
        borderTopLeftRadius="10px"
        borderTopRightRadius="10px"
        bg="orange.400"
      >
        <HStack>
          <Icon as={nameIcon} w={6} h={6} />
          <Text fontSize="lg">{name}</Text>
        </HStack>
      </Box>

      <Box
        id="scroll-area"
        bg="white"
        borderBottomLeftRadius="10px"
        borderBottomRightRadius="10px"
        maxH={`calc(${screenHeight}px - 450px)`}
        overflow="auto"
      >
        {recodes.length ? (
          recodes.map((item, idx) => (
            <Box key={`${item.recodeId}-${idx}`}>
              <Flex
                key={item.recodeId}
                px={4}
                align="center"
                bg="white"
                h="50px"
                w="100%"
              >
                <HStack>
                  <Icon as={labelIcon} w={6} h={6} color="orange.600" />
                  <Text>
                    {idx + 1}
                    {label}
                  </Text>
                </HStack>
                <Spacer />
                <HStack spacing={4}>
                  <Text fontSize="xl">{formatValue(item.value)}</Text>
                  <Icon
                    as={TiDelete}
                    w={6}
                    h={6}
                    color="red.300"
                    onClick={() => deleteRecord(idx)}
                  />
                </HStack>
              </Flex>
              <Divider />
            </Box>
          ))
        ) : (
          <HStack px={4} h="50px" lineHeight="50px">
            <Icon as={GrEdit} w={6} h={6} />
            <Text>記録を入力してください</Text>
          </HStack>
        )}
      </Box>
    </Box>
  );
};

export default ModalDisplayRecord;
