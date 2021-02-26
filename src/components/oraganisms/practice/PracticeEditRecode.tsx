import { DeleteIcon } from '@chakra-ui/icons';
import { HStack, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { FC, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { MobileNumberKeyboard, ModalDisplayRecord } from '..';
import { useDeviceInfo, useOutsideClick } from '../../../hooks';

import { db } from '../../../lib/firebase';
import { Recode } from '../../../models/users';
import { userState } from '../../../recoil/users/user';
import { formatTimeNotationAtInput } from '../../../utils/formatTimeNotationAtInput';

import { InputNumber, InputReadonly } from '../../molecules';

type Props = {
  menuId: string;
  items: Recode;
  recodes: Recode[];
  setRecodes: React.Dispatch<React.SetStateAction<Recode[]>>;
  idx: number;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
};

const PracticeEditRecode: FC<Props> = ({
  menuId,
  items,
  recodes,
  setRecodes,
  index,
  idx,
  setIndex,
}) => {
  const user = useRecoilValue(userState);

  const [recode, setRecode] = useState(items.value);
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

  // 編集への切り替え(recodeクリック時の処理)
  const handleClick = (idx: number, value: string) => {
    setRecode(value);
    setIndex(idx);
    const selectedIndex = recodes.findIndex(
      (recode) => recode.recodeId === idx
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
        inputValue={recode}
        setInputValue={setRecode}
        writeRecode={updateRecodeInMobile}
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

export default PracticeEditRecode;
