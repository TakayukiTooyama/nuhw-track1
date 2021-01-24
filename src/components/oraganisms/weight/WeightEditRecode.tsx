import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  IconButton,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import { FC, FocusEvent, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

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
  // Global State
  const user = useRecoilValue(userState);

  // Local State
  const [recode, setRecode] = useState(items.value);
  const [editToggle, setEditToggle] = useState(items.editting);
  const inputRef = useRef<HTMLDivElement | null>(null);

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
  const handleBlur = async (
    e: FocusEvent<HTMLDivElement>,
    id: number,
    value: string
  ) => {
    const selectedIndex = recodes.findIndex((recode) => recode.recodeId === id);
    if (inputRef.current?.contains(e.target)) return;
    if (recode === '') {
      recodes[selectedIndex] = {
        recodeId: id,
        value,
        editting: false,
      };
      setEditToggle(false);
      setRecodes(recodes);
    } else {
      if (user === null) return;
      const newRecodes = recodes;
      recodes[selectedIndex] = {
        recodeId: selectedIndex,
        value,
        editting: false,
      };
      await weightsRef.update({ recodes: newRecodes }).then(() => {
        setRecodes(newRecodes);
        setEditToggle(false);
        setIndex(recodes.length);
        setRecode('');
      });
    }
  };

  return (
    <Flex align="center">
      <Text color="gray.400" w="100%" maxW="45px">{`${idx + 1}set`}</Text>
      {editToggle ? (
        <Box ref={inputRef} bg="red.300">
          <Flex justify="space-between" align="center" w="100%" maxW="200px">
            <NumberInput
              value={recode}
              onChange={handleChange}
              onBlur={(e) => handleBlur(e, items.recodeId, items.value)}
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
        </Box>
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
