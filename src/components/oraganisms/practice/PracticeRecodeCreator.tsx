import {
  Box,
  Button,
  HStack,
  NumberInput,
  NumberInputField,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { MobileNumberKeyboard } from '..';

import { db } from '../../../lib/firebase';
import { Menu, Recode } from '../../../models/users';
import { userState } from '../../../recoil/users/user';
import { useDeviceInfo } from '../../../hooks';
import { formatTimeNotationAtInput } from '../../../utils/formatTimeNotationAtInput';
import { ModalDisplayRecord } from '..';

type Props = {
  index: number;
  recodes: Recode[];
  menuId: string;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setRecodes: React.Dispatch<React.SetStateAction<Recode[]>>;
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
};

const PracticeRecodeCreator: FC<Props> = ({
  index,
  recodes,
  menuId,
  setIndex,
  setRecodes,
}) => {
  const user = useRecoilValue(userState);
  const [recode, setRecode] = useState('');
  const [isOpenInput, setIsOpenInput] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { deviceInfo } = useDeviceInfo();

  const practicesRef = db
    .collection('users')
    .doc(user?.uid)
    .collection('practices')
    .doc(menuId);

  // 編集を離れて場合 or 変更後の処理
  const handleBlur = () => {
    if (deviceInfo === 'Desktop') {
      setIsOpenInput(false);
      setRecode('');
    }
  };

  // 記録入力処理
  const handleChange = (valueAsString: string, _valueAsNumber: number) => {
    setRecode(valueAsString);
  };

  // PCで新しく記録を追加
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

  // スマホで新しく記録を追加
  const addRecodeInMobile = async (inputValue: string, _index: number) => {
    if (user === null) return;
    const newRecode = { recodeId: index, value: inputValue, editting: false };
    setRecodes((prev) => [...prev, newRecode]);
    setIndex(index + 1);
    await practicesRef.update({ recodes: [...recodes, newRecode] });
  };

  // 入力モードへ切り替え & indexを戻す
  const InputToggle = () => {
    setIndex(recodes.length);
    if (deviceInfo === 'Mobile') {
      onOpen();
    } else {
      setIsOpenInput(true);
    }
  };

  // 記録を追加していって範囲外となったら範囲の一番したまでスクロール
  useEffect(() => {
    const scrollArea = document.querySelector('#scroll-area');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  });

  return (
    <>
      <Box mb={4}>
        {isOpenInput ? (
          <HStack>
            <Text color="gray.400" w="100%" maxW="45px">
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
        ) : (
          <HStack>
            <Box minW="45px" />
            <Button w="100%" maxW="200px" shadow="base" onClick={InputToggle}>
              ＋
            </Button>
          </HStack>
        )}
      </Box>
      <MobileNumberKeyboard
        disableStrings={['+/-', '.']}
        idx={index}
        isOpen={isOpen}
        onClose={onClose}
        inputValue={recode}
        setInputValue={setRecode}
        writeRecode={addRecodeInMobile}
        label="本目"
        format={formatTimeNotationAtInput}
      >
        <ModalDisplayRecord
          recodes={recodes}
          setRecodes={setRecodes}
          menuId={menuId}
        />
      </MobileNumberKeyboard>
    </>
  );
};

export default PracticeRecodeCreator;
