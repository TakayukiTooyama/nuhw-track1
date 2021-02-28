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
  records: Record[];
  menuId: string;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setRecords: React.Dispatch<React.SetStateAction<Record[]>>;
  setMenus: React.Dispatch<React.SetStateAction<WeightMenu[]>>;
};

const WeightRecordCreator: FC<Props> = ({
  name,
  index,
  records,
  menuId,
  setIndex,
  setRecords,
}) => {
  // Global State
  const user = useRecoilValue(userState);

  // Local State
  const [record, setRecord] = useState('');
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
      setRecord('');
    }
  };

  // 記録入力処理
  const handleChange = (valueAsString: string) => {
    setRecord(valueAsString);
  };

  // PCで新しく記録を追加
  const addRecord = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (user === null) return;
    if (e.key === 'Enter') {
      const newRecord = { recordId: index, value: record, editting: false };
      await weightsRef.update({ records: [...records, newRecord] }).then(() => {
        setRecords((prev) => [...prev, newRecord]);
        setIndex(index + 1);
        setRecord('');
      });
    }
  };

  // スマホで新しく記録を追加
  const addRecordInMobile = async (inputValue: string, _index: number) => {
    if (user === null) return;
    const newRecord = { recordId: index, value: inputValue, editting: false };
    setRecords((prev) => [...prev, newRecord]);
    setIndex(index + 1);
    await weightsRef.update({ records: [...records, newRecord] });
  };

  // 入力モードへ切り替え & indexを戻す
  const InputToggle = () => {
    setIndex(records?.length);
    if (deviceInfo === 'Mobile') {
      onOpen();
    } else {
      setIsOpenInput(true);
    }
  };

  // モバイル端末での記録削除
  const deleteRecordInMobile = async (index: number) => {
    if (user === null) return;
    const newRecords = records.filter((_item, idx) => idx !== index);
    setRecords(newRecords);
    await weightsRef.update({ records: newRecords });
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
            onKeyDown={addRecord}
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
        setInputValue={setRecord}
        writeRecord={addRecordInMobile}
        label="セット目"
      >
        <ModalDisplayRecord
          name={name}
          label="セット目"
          nameIcon={GiWeightLiftingUp}
          labelIcon={GiWeight}
          records={records}
          formatValue={(input: string) => `${input}kg`}
          deleteRecord={deleteRecordInMobile}
        />
      </MobileNumberKeyboard>
    </>
  );
};

export default WeightRecordCreator;
