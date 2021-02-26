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
  recodes: Record[];
  setRecodes: React.Dispatch<React.SetStateAction<Record[]>>;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
};

const PracticeEditRecode: FC<Props> = ({
  name,
  idx,
  index,
  menuId,
  items,
  recodes,
  setRecodes,
  setIndex,
}) => {
  const user = useRecoilValue(userState);

  const [record, setRecode] = useState(items.value);
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
        setIndex(recodes.length);
        setEditToggle(false);
      });
    }
  };

  // スマホでの編集処理
  const updateRecodeInMobile = async (inputValue: string, idx: number) => {
    if (user === null) return;
    if (idx === recodes.length) {
      const newRecode = { recodeId: idx, value: inputValue, editting: false };
      setRecodes((prev) => [...prev, newRecode]);
      setIndex(idx + 1);
      setRecode('');
      await practicesRef.update({ recodes: [...recodes, newRecode] });
    } else {
      const newRecodes = recodes;
      recodes[idx] = { recodeId: idx, value: inputValue, editting: false };
      setRecodes(newRecodes);
      setIndex(recodes.length);
      setRecode('');
      await practicesRef.update({ recodes: newRecodes });
    }
  };

  // 記録の削除
  const deleteRecode = async (recodeId: number) => {
    const newRecodes = recodes.filter((_recode, idx) => idx !== recodeId);
    if (user === null) return;
    const practicesRef = db
      .collection('users')
      .doc(user.uid)
      .collection('practices')
      .doc(menuId);
    await practicesRef.update({ recodes: newRecodes }).then(() => {
      setRecodes(newRecodes);
    });
  };

  // モバイル端末での記録削除
  const deleteRecodeInMobile = async (index: number) => {
    if (user === null) return;
    const newRecodes = recodes.filter((_item, idx) => idx !== index);
    setRecodes(newRecodes);
    await practicesRef.update({ recodes: newRecodes });
  };

  // 編集への切り替え(recodeクリック時の処理)
  const handleClick = (idx: number, value: string) => {
    setRecode(value);
    setIndex(idx);
    const selectedIndex = recodes.findIndex(
      (record) => record.recodeId === idx
    );
    recodes[selectedIndex] = { recodeId: idx, value, editting: true };
    setRecodes(recodes);

    if (deviceInfo === 'Mobile') {
      onOpen();
    } else {
      setEditToggle(true);
    }
  };

  // 編集を離れた時
  const handleBlur = () => {
    if (deviceInfo === 'Desktop') {
      setRecodes(recodes);
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
              onKeyDown={(e) => updateRecode(e, idx, record)}
            />
            <IconButton
              aria-label="record-delete"
              bg="none"
              _hover={{ bg: 'gray.100' }}
              icon={<DeleteIcon color="red.400" />}
              onClick={() => deleteRecode(idx)}
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
        setInputValue={setRecode}
        writeRecode={updateRecodeInMobile}
        label="本目"
        format={formatTimeNotationAtInput}
      >
        <ModalDisplayRecord
          name={name}
          label="本目"
          nameIcon={FaRunning}
          labelIcon={RiTimerFill}
          recodes={recodes}
          formatValue={formatTimeNotationAtInput}
          deleteRecord={deleteRecodeInMobile}
        />
      </MobileNumberKeyboard>
    </>
  );
};

export default PracticeEditRecode;
