import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import { FC, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useOutsideClick } from '../../../hooks';

import { db } from '../../../lib/firebase';
import { Recode } from '../../../models/users';
import { userState } from '../../../recoil/users/user';

type Props = {
  idx: number;
  menuId: string;
  items: Recode;
  recodes: Recode[];
  setRecodes: React.Dispatch<React.SetStateAction<Recode[]>>;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
};

const WeightEditRecode: FC<Props> = ({
  items,
  idx,
  menuId,
  recodes,
  setRecodes,
  setIndex,
}) => {
  const user = useRecoilValue(userState);

  const [recode, setRecode] = useState(items.value);
  const [editToggle, setEditToggle] = useState(items.editting);

  const ref = useRef<HTMLDivElement>(null);

  const weightsRef = db
    .collection('users')
    .doc(user?.uid)
    .collection('weights')
    .doc(menuId);

  // 新しく追加するための入力処理
  const handleChange = (valueAsString: string, _valueAsNumber: number) => {
    setRecode(valueAsString);
  };

  // 記録の編集処理
  const updateRecode = async (
    e: React.KeyboardEvent<HTMLElement>,
    index: number,
    value: string
  ) => {
    if (user === null) return;
    if (e.key === 'Enter') {
      const newRecodes = recodes;
      recodes[index] = { recodeId: index, value, editting: false };
      await weightsRef.update({ recodes: newRecodes }).then(() => {
        setRecodes(newRecodes);
        setEditToggle(false);
        setIndex(recodes.length);
        setRecode('');
      });
    }
  };

  // 記録の削除
  const deleteRecode = async (recodeId: number) => {
    const newRecodes = recodes.filter((_recode, idx) => idx !== recodeId);
    if (user === null) return;
    const weightsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('weights')
      .doc(menuId);
    await weightsRef.update({ recodes: newRecodes }).then(() => {
      setRecodes(newRecodes);
    });
  };

  // 編集への切り替え(recodeクリック時の処理)
  const handleClick = (id: number, value: string) => {
    setRecode(value);
    setIndex(id);
    const selectedIndex = recodes.findIndex((recode) => recode.recodeId === id);
    recodes[selectedIndex] = { recodeId: id, value, editting: true };
    setRecodes(recodes);
    setEditToggle(true);
  };

  // 編集を離れた時
  const handleBlur = async (id: number, value: string) => {
    const selectedIndex = recodes.findIndex((recode) => recode.recodeId === id);

    const newRecodes = recodes;
    recodes[selectedIndex] = {
      recodeId: selectedIndex,
      value,
      editting: false,
    };

    if (recode === '') {
      setEditToggle(false);
      setRecodes(recodes);
    } else {
      await weightsRef.update({ recodes: newRecodes }).then(() => {
        setRecodes(newRecodes);
        setEditToggle(false);
        setRecode('');
        setIndex(recodes.length);
      });
    }
  };

  useOutsideClick(ref, () => handleBlur(items.recodeId, recode));

  return (
    <Flex align="center">
      <Text color="gray.400" w="100%" maxW="45px">{`${idx + 1}set`}</Text>
      {editToggle ? (
        <HStack spacing={2} ref={ref}>
          <Flex justify="space-between" align="center" w="100%" maxW="200px">
            <NumberInput
              value={recode}
              onChange={handleChange}
              onKeyDown={(e) => updateRecode(e, idx, recode)}
            >
              <NumberInputField autoFocus />
            </NumberInput>
            <Text color="gray.400" ml={2} mr={editToggle ? '17px' : '0px'}>
              kg
            </Text>
          </Flex>
          <IconButton
            aria-label="recode-delete"
            bg="none"
            _hover={{ bg: 'gray.100' }}
            icon={<DeleteIcon color="red.400" />}
            onClick={() => deleteRecode(idx)}
            ml={1}
          />
        </HStack>
      ) : (
        <>
          <Flex
            justify="space-between"
            align="center"
            w="100%"
            maxW="200px"
            px={4}
            lineHeight="2.4rem"
            height="2.5rem"
            borderRadius="0.375rem"
            border="1px solid"
            borderColor="inherit"
            onClick={() => handleClick(items.recodeId, items.value)}
          >
            <Text>{items.value}</Text>
            <Text color="gray.400">kg</Text>
          </Flex>
          <Box w="100%" maxW="40px" h="40px" ml={1} />
        </>
      )}
    </Flex>
  );
};

export default WeightEditRecode;
