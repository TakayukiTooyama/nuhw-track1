import { DeleteIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { FC, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useOutsideClick } from '../../../hooks';

import { insertStr } from '../../../hooks/useInsertStr';
import { db } from '../../../lib/firebase';
import { Recode } from '../../../models/users';
import { userState } from '../../../recoil/users/user';
import { InputNumber } from '../../molecules';

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
  const user = useRecoilValue(userState);

  const [recode, setRecode] = useState(items.value);
  const [editToggle, setEditToggle] = useState(items.editting);

  const ref = useRef<HTMLDivElement>(null);

  const practicesRef = db
    .collection('users')
    .doc(user?.uid)
    .collection('practices')
    .doc(menuId);

  // 新しく追加するための入力処理
  const handleChange = (valueAsString: string) => {
    setRecode(valueAsString);
  };

  // 記録の編集処理
  const updateRecode = async (
    e: React.KeyboardEvent<HTMLElement>,
    idx: number,
    value: string
  ) => {
    if (user === null) return;
    if (e.key === 'Enter') {
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

  // 記録の削除
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

  // 編集への切り替え(recodeクリック時の処理)
  const handleClick = (id: number, value: string) => {
    setRecode(value);
    setIndex(id);
    const selectedIndex = recodes.findIndex((recode) => recode.recodeId === id);
    recodes[selectedIndex] = { recodeId: id, value, editting: true };
    setRecodes(recodes);
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

    if (recode === '' || recode === items.value) {
      setRecodes(recodes);
    } else {
      await practicesRef.update({ recodes: newRecodes }).then(() => {
        setRecodes(newRecodes);
        setEditToggle(false);
        setRecode('');
        setIndex(recodes.length);
      });
    }
  };

  useOutsideClick(ref, () => handleBlur(items.recodeId, recode));

  return (
    <>
      <HStack spacing={2}>
        <Text color="gray.400" w="100%" maxW="45px">{`${idx + 1}本目`}</Text>
        {editToggle ? (
          <HStack spacing={2} ref={ref}>
            <InputNumber
              value={recode}
              onChange={handleChange}
              onKeyDown={(e) => updateRecode(e, idx, recode)}
            />
            <IconButton
              aria-label="recode-delete"
              bg="none"
              _hover={{ bg: 'gray.100' }}
              icon={<DeleteIcon color="red.400" />}
              onClick={() => deleteRecode(idx)}
            />
          </HStack>
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
