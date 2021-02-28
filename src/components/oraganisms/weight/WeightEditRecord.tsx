import { DeleteIcon } from '@chakra-ui/icons';
import {
  Flex,
  HStack,
  IconButton,
  NumberInput,
  NumberInputField,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FC, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { GiWeightLiftingUp, GiWeight } from 'react-icons/gi';
import { MobileNumberKeyboard, ModalDisplayRecord } from '..';
import { useDeviceInfo, useOutsideClick } from '../../../hooks';
import { db } from '../../../lib/firebase';
import { Record } from '../../../models/users';
import { userState } from '../../../recoil/users/user';

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

const WeightEditRecord: FC<Props> = ({
  name,
  items,
  idx,
  menuId,
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

  const weightsRef = db
    .collection('users')
    .doc(user?.uid)
    .collection('weights')
    .doc(menuId);

  // 新しく追加するための入力処理
  const handleChange = (valueAsString: string, _valueAsNumber: number) => {
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
      await weightsRef.update({ records: newRecords }).then(() => {
        setRecords(newRecords);
        setIndex(records?.length);
        setEditToggle(false);
        setRecord('');
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
      await weightsRef.update({ records: [...records, newRecord] });
    } else {
      const newRecords = records;
      records[idx] = { recordId: idx, value: inputValue, editting: false };
      setRecords(newRecords);
      setIndex(records?.length);
      setRecord('');
      await weightsRef.update({ records: newRecords });
    }
  };

  // 記録の削除
  const deleteRecord = async (recordId: number) => {
    const newRecords = records.filter((_Record, idx) => idx !== recordId);
    if (user === null) return;
    const weightsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('weights')
      .doc(menuId);
    await weightsRef.update({ records: newRecords }).then(() => {
      setRecords(newRecords);
    });
  };

  // モバイル端末での記録削除
  const deleteRecordInMobile = async (index: number) => {
    if (user === null) return;
    const newRecords = records.filter((_item, idx) => idx !== index);
    setRecords(newRecords);
    await weightsRef.update({ records: newRecords });
  };

  // 編集への切り替え(Recordクリック時の処理)
  const handleClick = (id: number, value: string) => {
    setRecord(value);
    setIndex(id);
    const selectedIndex = records.findIndex((record) => record.recordId === id);
    records[selectedIndex] = { recordId: id, value, editting: true };
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
      <Flex align="center">
        <Text color="gray.400" w="100%" maxW="45px">{`${idx + 1}set`}</Text>
        {editToggle ? (
          <HStack spacing={1} ref={ref} w="100%">
            <Flex align="center" w="100%" maxW="255px">
              <NumberInput
                w="100%"
                value={record}
                onChange={handleChange}
                onKeyDown={(e) => updateRecord(e, idx, record)}
              >
                <NumberInputField autoFocus />
              </NumberInput>
              <Text color="gray.400" ml={2} mr="17px">
                kg
              </Text>
            </Flex>
            <IconButton
              aria-label="record-delete"
              bg="none"
              icon={<DeleteIcon color="red.400" />}
              onClick={() => deleteRecord(idx)}
            />
          </HStack>
        ) : (
          <Flex
            justify="space-between"
            align="center"
            w="100%"
            maxW="255px"
            px={4}
            mr="44px"
            lineHeight="2.4rem"
            height="2.5rem"
            borderRadius="0.375rem"
            border="1px solid"
            borderColor="inherit"
            onClick={() => handleClick(items.recordId, items.value)}
          >
            <Text>{items.value}</Text>
            <Text color="gray.400">kg</Text>
          </Flex>
        )}
      </Flex>
      <MobileNumberKeyboard
        disableStrings={['+/-']}
        idx={idx}
        isOpen={isOpen}
        onClose={onClose}
        inputValue={record}
        setInputValue={setRecord}
        writeRecord={updateRecordInMobile}
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

export default WeightEditRecord;
