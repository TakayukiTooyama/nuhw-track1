import { DeleteIcon } from '@chakra-ui/icons';
import { HStack, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { FC, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { FaRunning } from 'react-icons/fa';
import { RiTimerFill } from 'react-icons/ri';
import { MobileNumberKeyboard, ModalDisplayRecord } from '..';
import { useDeviceInfo, useOutsideClick } from '../../../hooks';
import { db } from '../../../lib/firebase';
import { Record } from '../../../models/users';
import { userState } from '../../../recoil/users/user';
import { formatTimeNotationAtInput } from '../../../utils/formatTimeNotationAtInput';
import { InputNumber, InputReadonly } from '../../molecules';

type Props = {
  name: string;
  idx: number;
  index: number;
  menuId: string;
  items: Record;
  records: Record[];
  setRecords: React.Dispatch<React.SetStateAction<Record[]>>;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
};

const PracticeEditRecord: FC<Props> = ({
  name,
  idx,
  index,
  menuId,
  items,
  records,
  setRecords,
  setIndex,
}) => {
  const user = useRecoilValue(userState);

  const [record, setRecord] = useState(items.value);
  const [editToggle, setEditToggle] = useState(items.editting);

  const ref = useRef<HTMLDivElement>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { deviceInfo } = useDeviceInfo();

  const practicesRef = db
    .collection('users')
    .doc(user?.uid)
    .collection('practices')
    .doc(menuId);

  // 新しく追加するための入力処理
  const handleChange = (valueAsString: string) => {
    setRecord(valueAsString);
  };

  // 記録の編集処理
  const updateRecord = async (
    e: React.KeyboardEvent<HTMLElement>,
    idx: number,
    value: string
  ) => {
    if (user === null) return;
    if (e.key === 'Enter') {
      const newRecords = records;
      records[idx] = { recordId: idx, value, editting: false };
      await practicesRef.update({ records: newRecords }).then(() => {
        setRecords(newRecords);
        setIndex(records?.length);
        setEditToggle(false);
      });
    }
  };

  // スマホでの編集処理
  const updateRecordInMobile = async (inputValue: string, idx: number) => {
    if (user === null) return;
    if (idx === records?.length) {
      const newRecord = { recordId: idx, value: inputValue, editting: false };
      setRecords((prev) => [...prev, newRecord]);
      setIndex(idx + 1);
      setRecord('');
      await practicesRef.update({ records: [...records, newRecord] });
    } else {
      const newRecords = records;
      records[idx] = { recordId: idx, value: inputValue, editting: false };
      setRecords(newRecords);
      setIndex(records?.length);
      setRecord('');
      await practicesRef.update({ records: newRecords });
    }
  };

  // 記録の削除
  const deleteRecord = async (recordId: number) => {
    const newRecords = records.filter((_Record, idx) => idx !== recordId);
    if (user === null) return;
    const practicesRef = db
      .collection('users')
      .doc(user.uid)
      .collection('practices')
      .doc(menuId);
    await practicesRef.update({ records: newRecords }).then(() => {
      setRecords(newRecords);
    });
  };

  // モバイル端末での記録削除
  const deleteRecordInMobile = async (index: number) => {
    if (user === null) return;
    const newRecords = records.filter((_item, idx) => idx !== index);
    setRecords(newRecords);
    await practicesRef.update({ records: newRecords });
  };

  // 編集への切り替え(Recordクリック時の処理)
  const handleClick = (idx: number, value: string) => {
    setRecord(value);
    setIndex(idx);
    const selectedIndex = records.findIndex(
      (record) => record.recordId === idx
    );
    records[selectedIndex] = { recordId: idx, value, editting: true };
    setRecords(records);

    if (deviceInfo === 'Mobile') {
      onOpen();
    } else {
      setEditToggle(true);
    }
  };

  // 編集を離れた時
  const handleBlur = () => {
    if (deviceInfo === 'Desktop') {
      setRecords(records);
      setEditToggle(false);
    }
  };
  useOutsideClick(ref, () => handleBlur());

  return (
    <>
      <HStack spacing={2}>
        <Text color="gray.400" w="100%" maxW="50px">{`${idx + 1}本目`}</Text>
        {editToggle ? (
          <HStack spacing={2} ref={ref}>
            <InputNumber
              value={record}
              onChange={handleChange}
              onKeyDown={(e) => updateRecord(e, idx, record)}
            />
            <IconButton
              aria-label="record-delete"
              bg="none"
              _hover={{ bg: 'gray.100' }}
              icon={<DeleteIcon color="red.400" />}
              onClick={() => deleteRecord(idx)}
            />
          </HStack>
        ) : (
          <InputReadonly
            defaultValue={formatTimeNotationAtInput(items.value)}
            onClick={() => handleClick(idx, items.value)}
          />
        )}
      </HStack>
      <MobileNumberKeyboard
        disableStrings={['+/-', '.']}
        idx={index}
        isOpen={isOpen}
        onClose={onClose}
        inputValue={record}
        setInputValue={setRecord}
        writeRecord={updateRecordInMobile}
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

export default PracticeEditRecord;
