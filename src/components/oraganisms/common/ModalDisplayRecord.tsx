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
import { formatTimeNotation } from '../../../utils/formatTimeNotation';
import { FaRunning } from 'react-icons/fa';
import { RiTimerFill } from 'react-icons/ri';
import { TiDelete } from 'react-icons/ti';
import { GrEdit } from 'react-icons/gr';
import { Recode } from '../../../models/users';
import { userState } from '../../../recoil/users/user';
import { useRecoilValue } from 'recoil';
import { db } from '../../../lib/firebase';

type Props = {
  recodes: Recode[];
  setRecodes: React.Dispatch<React.SetStateAction<Recode[]>>;
  menuId: string;
};

const ModalDisplayRecord: VFC<Props> = ({ recodes, setRecodes, menuId }) => {
  const { screenHeight } = useScreenHeight();
  const user = useRecoilValue(userState);

  const practicesRef = db
    .collection('users')
    .doc(user?.uid)
    .collection('practices')
    .doc(menuId);

  // スマホで記録削除
  const deleteRecodeInMobile = async (index: number) => {
    if (user === null) return;
    const newRecodes = recodes.filter((_item, idx) => idx !== index);
    setRecodes(newRecodes);
    await practicesRef.update({ recodes: newRecodes });
  };

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
          <Icon as={FaRunning} w={6} h={6} />
          <Text fontSize="lg">100m</Text>
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
                  <Icon as={RiTimerFill} w={6} h={6} color="orange.600" />
                  <Text>{idx + 1}本目</Text>
                </HStack>
                <Spacer />
                <HStack spacing={4}>
                  <Text fontSize="xl">{formatTimeNotation(item.value)}</Text>
                  <Icon
                    as={TiDelete}
                    w={6}
                    h={6}
                    color="red.300"
                    onClick={() => deleteRecodeInMobile(idx)}
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
