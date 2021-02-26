import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { GiWeightLiftingUp, GiWeight } from 'react-icons/gi';

import { MobileNumberKeyboard, ModalDisplayRecord } from '..';
import { useDeviceInfo } from '../../../hooks';
import { db } from '../../../lib/firebase';
import { Record, WeightMenu } from '../../../models/users';
import { userState } from '../../../recoil/users/user';
import { InputNumber } from '../../molecules';

type Props = {
  name: string;
  index: number;
  recodes: Record[];
  menuId: string;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setRecodes: React.Dispatch<React.SetStateAction<Record[]>>;
  setMenus: React.Dispatch<React.SetStateAction<WeightMenu[]>>;
};

const WeightRecodeCreator: FC<Props> = ({
  name,
  index,
  recodes,
  menuId,
  setIndex,
  setRecodes,
}) => {
  // Global State
  const user = useRecoilValue(userState);

  // Local State
  const [record, setRecode] = useState('');
  const [isOpenInput, setIsOpenInput] = useState(false);

  // hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { deviceInfo } = useDeviceInfo();

  const weightsRef = db
    .collection('users')
    .doc(user?.uid)
    .collection('weights')
    .doc(menuId);

  // 編集を離れて場合 or 変更後の処理
  const handleBlur = async () => {
    if (deviceInfo === 'Desktop') {
      setIsOpenInput(false);
      setRecode('');
    }
  };

  // 記録入力処理
  const handleChange = (valueAsString: string) => {
    setRecode(valueAsString);
  };

  // PCで新しく記録を追加
  const addRecode = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (user === null) return;
    if (e.key === 'Enter') {
      const newRecode = { recodeId: index, value: record, editting: false };
      await weightsRef.update({ recodes: [...recodes, newRecode] }).then(() => {
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
    await weightsRef.update({ recodes: [...recodes, newRecode] });
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

  // モバイル端末での記録削除
  const deleteRecodeInMobile = async (index: number) => {
    if (user === null) return;
    const newRecodes = recodes.filter((_item, idx) => idx !== index);
    setRecodes(newRecodes);
    await weightsRef.update({ recodes: newRecodes });
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
      {isOpenInput ? (
        <Flex align="center">
          <Text color="gray.400" w="100%" maxW="45px">
            {`${index + 1}set`}
          </Text>
          <InputNumber
            maxW="255px"
            value={record}
            placeholder="重量"
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={addRecode}
          />
          <Box w="100%" maxW="40px" h="40px" ml={1} />
        </Flex>
      ) : (
        <HStack spacing={1}>
          <Button w="100%" maxW="300px" shadow="base" onClick={InputToggle}>
            ＋
          </Button>
          <Box w="100%" maxW="40px" h="40px" />
        </HStack>
      )}
      <MobileNumberKeyboard
        disableStrings={['+/-']}
        idx={index}
        isOpen={isOpen}
        onClose={onClose}
        inputValue={record}
        setInputValue={setRecode}
        writeRecode={addRecodeInMobile}
        label="セット目"
      >
        <ModalDisplayRecord
          name={name}
          label="セット目"
          nameIcon={GiWeightLiftingUp}
          labelIcon={GiWeight}
          recodes={recodes}
          formatValue={(input: string) => `${input}kg`}
          deleteRecord={deleteRecodeInMobile}
        />
      </MobileNumberKeyboard>
    </>
  );
};

export default WeightRecodeCreator;
