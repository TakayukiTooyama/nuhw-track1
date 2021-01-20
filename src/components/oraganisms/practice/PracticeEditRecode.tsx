import { FC, useState } from 'react';
import {
  Box,
  HStack,
  IconButton,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { Recode } from '../../../models/users';
import { userState } from '../../../recoil/users/user';
import { db } from '../../../lib/firebase';
import { insertStr } from '../../../hooks/useInsertStr';
import { DeleteIcon } from '@chakra-ui/icons';

type Props = {
  idx: number;
  menuId: string;
  items: Recode;
  recodes: Recode[];
  setRecodes: React.Dispatch<React.SetStateAction<Recode[]>>;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
};

const PracticeEditRecode: FC<Props> = ({
  items,
  idx,
  menuId,
  recodes,
  setRecodes,
  setIndex,
}) => {
  //Global State
  const user = useRecoilValue(userState);

  //Local State
  const [recode, setRecode] = useState(items.value),
    [editToggle, setEditToggle] = useState(items.editting);

  //新しく追加するための入力処理
  const handleChange = (valueAsString: string, _valueAsNumber: number) => {
    setRecode(valueAsString);
  };

  //記録の編集処理
  const updateRecode = async (
    e: React.KeyboardEvent<HTMLElement>,
    idx: number,
    value: string
  ) => {
    if (user === null) return;
    if (e.key === 'Enter') {
      const practicesRef = db
        .collection('users')
        .doc(user.uid)
        .collection('practices')
        .doc(menuId);
      const newRecodes = recodes;
      recodes[idx] = { recodeId: idx, value, editting: false };
      await practicesRef.update({ recodes: newRecodes }).then(() => {
        setRecodes(newRecodes);
        setEditToggle(false);
        setIndex(recodes.length);
        setRecode('');
      });
    }
  };

  //記録の削除
  const deleteRecode = async (recodeId: number) => {
    const newRecodes = recodes.filter((_recode, idx) => idx !== recodeId);
    if (!user) return;
    const practicesRef = db
      .collection('users')
      .doc(user.uid)
      .collection('practices')
      .doc(menuId);
    await practicesRef.update({ recodes: newRecodes }).then(() => {
      setRecodes(newRecodes);
    });
  };

  //編集への切り替え(recodeクリック時の処理)
  const handleClick = (id: number, value: string) => {
    setRecode(value);
    setIndex(id);
    const selectedIndex = recodes.findIndex((recode) => recode.recodeId === id);
    recodes[selectedIndex] = { recodeId: id, value, editting: true };
    setRecodes(recodes);
    setEditToggle(true);
  };

  //編集を離れた時
  const handleBlur = (id: number, value: string) => {
    const selectedIndex = recodes.findIndex((recode) => recode.recodeId === id);
    recodes[selectedIndex] = {
      recodeId: id,
      value: value,
      editting: false,
    };
    setEditToggle(false);
    setRecodes(recodes);
  };

  return (
    <>
      <HStack spacing={2}>
        <Text color="gray.400" w="100%" maxW="45px">{`${idx + 1}本目`}</Text>
        {editToggle ? (
          <>
            <NumberInput
              maxW="200px"
              value={recode}
              onChange={handleChange}
              onBlur={() => handleBlur(items.recodeId, items.value)}
              onKeyDown={(e) => updateRecode(e, idx, recode)}
            >
              <NumberInputField autoFocus />
            </NumberInput>
            <IconButton
              aria-label="recode-delete"
              bg="none"
              _hover={{ bg: 'gray.100' }}
              icon={<DeleteIcon color="red.400" />}
              onClick={() => deleteRecode(idx)}
            />
          </>
        ) : (
          <Box
            align="left"
            w="100%"
            maxW="200px"
            px="1rem"
            lineHeight="2.4rem"
            height="2.5rem"
            borderRadius="0.375rem"
            border="1px solid"
            borderColor="inherit"
            onClick={() => handleClick(items.recodeId, items.value)}
          >
            {insertStr(items.value)}
          </Box>
        )}
      </HStack>
    </>
  );
};

export default PracticeEditRecode;
