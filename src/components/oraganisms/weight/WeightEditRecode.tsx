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
  recodes: Record[];
  setRecodes: React.Dispatch<React.SetStateAction<Record[]>>;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
};

const WeightEditRecode: FC<Props> = ({
  name,
  items,
  idx,
  menuId,
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

  const weightsRef = db
    .collection('users')
    .doc(user?.uid)
    .collection('weights')
    .doc(menuId);

  // 新しく追加するための入力処理
  const handleChange = (valueAsString: string, _valueAsNumber: number) => {
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
      await weightsRef.update({ recodes: newRecodes }).then(() => {
        setRecodes(newRecodes);
        setIndex(recodes.length);
        setEditToggle(false);
        setRecode('');
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
      await weightsRef.update({ recodes: [...recodes, newRecode] });
    } else {
      const newRecodes = recodes;
      recodes[idx] = { recodeId: idx, value: inputValue, editting: false };
      setRecodes(newRecodes);
      setIndex(recodes.length);
      setRecode('');
      await weightsRef.update({ recodes: newRecodes });
    }
  };

  // 記録の削除
  const deleteRecode = async (recodeId: number) => {
    const newRecodes = recodes.filter((_recode, idx) => idx !== recodeId);
    if (user === null) return;
    const weightsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('weights')
      .doc(menuId);
    await weightsRef.update({ recodes: newRecodes }).then(() => {
      setRecodes(newRecodes);
    });
  };

  // モバイル端末での記録削除
  const deleteRecodeInMobile = async (index: number) => {
    if (user === null) return;
    const newRecodes = recodes.filter((_item, idx) => idx !== index);
    setRecodes(newRecodes);
    await weightsRef.update({ recodes: newRecodes });
  };

  // 編集への切り替え(recodeクリック時の処理)
  const handleClick = (id: number, value: string) => {
    setRecode(value);
    setIndex(id);
    const selectedIndex = recodes.findIndex((record) => record.recodeId === id);
    recodes[selectedIndex] = { recodeId: id, value, editting: true };
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
      <Flex align="center">
        <Text color="gray.400" w="100%" maxW="45px">{`${idx + 1}set`}</Text>
        {editToggle ? (
          <HStack spacing={1} ref={ref} w="100%">
            <Flex align="center" w="100%" maxW="255px">
              <NumberInput
                w="100%"
                value={record}
                onChange={handleChange}
                onKeyDown={(e) => updateRecode(e, idx, record)}
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
              onClick={() => deleteRecode(idx)}
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
            onClick={() => handleClick(items.recodeId, items.value)}
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
        setInputValue={setRecode}
        writeRecode={updateRecodeInMobile}
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

export default WeightEditRecode;
