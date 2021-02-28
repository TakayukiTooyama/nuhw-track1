import {
  Button,
  HStack,
  NumberInput,
  NumberInputField,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { FaRunning } from 'react-icons/fa';
import { RiTimerFill } from 'react-icons/ri';
import { MobileNumberKeyboard } from '..';
import { db } from '../../../lib/firebase';
import { Menu, Record } from '../../../models/users';
import { userState } from '../../../recoil/users/user';
import { useDeviceInfo } from '../../../hooks';
import { formatTimeNotationAtInput } from '../../../utils/formatTimeNotationAtInput';
import { ModalDisplayRecord } from '..';

type Props = {
  name: string;
  index: number;
  records: Record[];
  menuId: string;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setRecords: React.Dispatch<React.SetStateAction<Record[]>>;
  setMenus: React.Dispatch<React.SetStateAction<Menu[]>>;
};

const PracticeRecordCreator: FC<Props> = ({
  name,
  index,
  records,
  menuId,
  setIndex,
  setRecords,
}) => {
  const user = useRecoilValue(userState);
  const [record, setRecord] = useState('');
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
      setRecord('');
    }
  };

  // 記録入力処理
  const handleChange = (valueAsString: string, _valueAsNumber: number) => {
    setRecord(valueAsString);
  };

  // PCで新しく記録を追加
  const addRecord = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (user === null) return;
    if (e.key === 'Enter') {
      const newRecord = { recordId: index, value: record, editting: false };
      await practicesRef
        .update({ records: [...records, newRecord] })
        .then(() => {
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
    await practicesRef.update({ records: [...records, newRecord] });
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
    await practicesRef.update({ records: newRecords });
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
        <HStack>
          <Text color="gray.400" w="100%" maxW="50px">
            {index + 1}本目
          </Text>
          <NumberInput
            maxW="200px"
            value={record}
            placeholder={`${index + 1}本目`}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={addRecord}
          >
            <NumberInputField autoFocus />
          </NumberInput>
        </HStack>
      ) : (
        <Button w="100%" maxW="259px" shadow="base" onClick={InputToggle}>
          ＋
        </Button>
      )}
      <MobileNumberKeyboard
        disableStrings={['+/-', '.']}
        idx={index}
        isOpen={isOpen}
        onClose={onClose}
        inputValue={record}
        setInputValue={setRecord}
        writeRecord={addRecordInMobile}
        label="本目"
        format={formatTimeNotationAtInput}
      >
        <ModalDisplayRecord
          name={name}
          label="本目"
          nameIcon={FaRunning}
          labelIcon={RiTimerFill}
          records={records}
          formatValue={formatTimeNotationAtInput}
          deleteRecord={deleteRecordInMobile}
        />
      </MobileNumberKeyboard>
    </>
  );
};

export default PracticeRecordCreator;
