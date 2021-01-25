import {
  Box,
  Button,
  HStack,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { db } from '../../../lib/firebase';
import { Menu, Recode } from '../../../models/users';
import { userState } from '../../../recoil/users/user';

type Props = {
  index: number;
  recodes: Recode[];
  menuId: string;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setRecodes: React.Dispatch<React.SetStateAction<Recode[]>>;
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
  toggleEdit: boolean;
  setToggleEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

const PracticeRecodeCreator: FC<Props> = ({
  index,
  recodes,
  menuId,
  setIndex,
  setRecodes,
  toggleEdit,
  setToggleEdit,
}) => {
  const user = useRecoilValue(userState);

  const [recode, setRecode] = useState('');

  const practicesRef = db
    .collection('users')
    .doc(user?.uid)
    .collection('practices')
    .doc(menuId);

  // 編集を離れて場合 or 変更後の処理
  const handleBlur = async () => {
    if (recode === '') {
      setToggleEdit(false);
      setRecode('');
    } else {
      if (user === null) return;
      const newRecode = { recodeId: index, value: recode, editting: false };
      await practicesRef
        .update({ recodes: [...recodes, newRecode] })
        .then(() => {
          setRecodes((prev) => [...prev, newRecode]);
          setIndex(index + 1);
          setToggleEdit(false);
          setRecode('');
          setToggleEdit(true);
        });
    }
  };

  // 記録入力処理
  const handleChange = (valueAsString: string, _valueAsNumber: number) => {
    setRecode(valueAsString);
  };

  // 新しく記録を追加するための処理
  const addRecode = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (user === null) return;
    if (e.key === 'Enter') {
      const newRecode = { recodeId: index, value: recode, editting: false };
      await practicesRef
        .update({ recodes: [...recodes, newRecode] })
        .then(() => {
          setRecodes((prev) => [...prev, newRecode]);
          setIndex(index + 1);
          setRecode('');
        });
    }
  };

  // 入力モードへ切り替え & indexを戻す
  const InputToggle = () => {
    setIndex(recodes.length);
    setToggleEdit(true);
  };

  return (
    <>
      <Box mb={4}>
        {toggleEdit ? (
          <HStack>
            <Text color="gray.400" w="45px">
              {index + 1}本目
            </Text>
            <NumberInput
              maxW="200px"
              value={recode}
              placeholder={`${index + 1}本目`}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={addRecode}
            >
              <NumberInputField autoFocus />
            </NumberInput>
          </HStack>
        ) : null}
      </Box>
      <Button ml={12} w="100%" maxW="200px" shadow="base" onClick={InputToggle}>
        ＋
      </Button>
    </>
  );
};

export default PracticeRecodeCreator;
