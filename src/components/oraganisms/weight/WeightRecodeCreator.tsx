import { Box, Button, Flex, Text } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { db } from '../../../lib/firebase';
import { Recode, WeightMenu } from '../../../models/users';
import { userState } from '../../../recoil/users/user';
import { InputNumber } from '../../molecules';

type Props = {
  index: number;
  recodes: Recode[];
  menuId: string;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setRecodes: React.Dispatch<React.SetStateAction<Recode[]>>;
  setMenus: React.Dispatch<React.SetStateAction<WeightMenu[]>>;
  toggleEdit: boolean;
  setToggleEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

const WeightRecodeCreator: FC<Props> = ({
  index,
  recodes,
  menuId,
  setIndex,
  setRecodes,
  toggleEdit,
  setToggleEdit,
}) => {
  // Global State
  const user = useRecoilValue(userState);

  // Local State
  const [recode, setRecode] = useState('');

  const practicesRef = db
    .collection('users')
    .doc(user?.uid)
    .collection('weights')
    .doc(menuId);

  // 編集を離れて場合 or 変更後の処理
  const handleBlur = async () => {
    if (recode === '') {
      setToggleEdit(false);
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
  const handleChange = (valueAsString: string) => {
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
      {toggleEdit ? (
        <Flex align="center">
          <Text color="gray.400" w="100%" maxW="45px">
            {`${index + 1}set`}
          </Text>
          <InputNumber
            value={recode}
            placeholder="重量"
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={addRecode}
          />
          <Box w="100%" maxW="40px" h="40px" ml={1} />
        </Flex>
      ) : (
        <Flex>
          <Button w="253px" shadow="base" onClick={InputToggle}>
            ＋
          </Button>
          <Box w="100%" maxW="40px" h="40px" ml={1} />
        </Flex>
      )}
    </>
  );
};

export default WeightRecodeCreator;
