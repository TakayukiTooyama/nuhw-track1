import { FC, useState } from 'react';
import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';

import { Recode } from '../../../models/users';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isComposedState, userAuthState } from '../../../recoil/users/user';
import { db } from '../../../lib/firebase';

type Props = {
  idx: number;
  menuId: string;
  items: Recode;
  recodes: Recode[];
  setRecodes: React.Dispatch<React.SetStateAction<Recode[]>>;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
};

const WeightEditRecode: FC<Props> = ({
  items,
  idx,
  menuId,
  recodes,
  setRecodes,
  setIndex,
}) => {
  //Global State
  const user = useRecoilValue(userAuthState);
  const [isComposed, setIsComposed] = useRecoilState(isComposedState);

  //Local State
  const [recode, setRecode] = useState(items.value),
    [editToggle, setEditToggle] = useState(items.editting);

  //新しく追加するための入力処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecode(e.target.value);
  };

  //記録の編集処理
  const updateRecode = async (
    e: React.KeyboardEvent<HTMLElement>,
    index: number,
    value: string
  ) => {
    if (user === null) return;
    if (isComposed) return;
    if (e.key === 'Enter') {
      const weightsRef = db
        .collection('users')
        .doc(user.uid)
        .collection('weights')
        .doc(menuId);
      const newRecodes = recodes;
      recodes[index] = { recodeId: index, value, editting: false };
      await weightsRef.update({ recodes: newRecodes }).then(() => {
        setRecodes(newRecodes);
        setEditToggle(false);
        setIndex(recodes.length);
        setRecode('');
      });
    }
  };

  //編集への切り替え(recodeクリック時の処理)
  const handleClick = (id: number, value: string) => {
    setRecode(value);
    setIndex(id);
    const selectedIndex = recodes.findIndex((recode) => recode.recodeId === id);
    recodes[selectedIndex] = { recodeId: id, value, editting: true };
    setRecodes(recodes);
    setEditToggle(true);
  };

  //編集を離れた時
  const handleBlur = (id: number, value: string) => {
    const selectedIndex = recodes.findIndex((recode) => recode.recodeId === id);
    recodes[selectedIndex] = {
      recodeId: id,
      value: value,
      editting: false,
    };
    setEditToggle(false);
    setRecodes(recodes);
  };

  return (
    <>
      <Flex key={`recode-${idx}-${items.value}`} align="center">
        <Text color="gray.400" mx={3}>{`${idx + 1}set`}</Text>
        {editToggle ? (
          <Input
            autoFocus
            w="80%"
            maxW="200px"
            value={recode}
            onChange={handleChange}
            onBlur={() => handleBlur(items.recodeId, items.value)}
            onKeyDown={(e) => updateRecode(e, idx, recode)}
            onCompositionStart={() => setIsComposed(true)}
            onCompositionEnd={() => setIsComposed(false)}
          />
        ) : (
          <InputGroup w="100%" maxW="200px">
            <Input
              readOnly={true}
              textAlign="center"
              defaultValue={items.value}
              onClick={() => handleClick(items.recodeId, items.value)}
            />
            <InputRightElement color="gray.400" children="kg" />
          </InputGroup>
        )}
      </Flex>
    </>
  );
};

export default WeightEditRecode;
