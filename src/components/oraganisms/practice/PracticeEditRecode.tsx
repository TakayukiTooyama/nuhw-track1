import { FC, useState } from 'react';
import { Flex, Input, Text } from '@chakra-ui/react';

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

//最初に0が着いていたら削除
const replaceZero = (input: string) => {
  const firstIndex = input.slice(0, 1);
  if (firstIndex === '0') {
    return firstIndex.replace('0', '') + input.slice(1, input.length);
  }
  return input;
};

//入力された文字列をタイム表記に変換
export const insertStr = (input: string) => {
  const len = input.length;
  if (len > 2 && len < 5)
    return replaceZero(
      input.slice(0, len - 2) + '"' + input.slice(len - 2, len)
    );
  if (len > 4 && len < 7)
    return replaceZero(
      input.slice(0, len - 4) +
        "'" +
        input.slice(len - 4, len - 2) +
        '"' +
        input.slice(len - 2, len)
    );
  if (len > 6 && len < 9)
    return replaceZero(
      input.slice(0, len - 6) +
        ':' +
        input.slice(len - 6, len - 4) +
        "'" +
        input.slice(len - 4, len - 2) +
        '"' +
        input.slice(len - 2, len)
    );
  return replaceZero(input);
};

const PracticeEditRecode: FC<Props> = ({
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
    if (user === null || user === undefined) return;
    if (isComposed) return;
    if (e.key === 'Enter') {
      const practicesRef = db
        .collection('users')
        .doc(user.uid)
        .collection('practices')
        .doc(menuId);
      const newRecodes = recodes;
      recodes[index] = { recodeId: index, value, editting: false };
      await practicesRef.update({ recodes: newRecodes }).then(() => {
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
        <Text color="gray.400" mx={2}>{`${idx + 1}本目`}</Text>
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
          <Input
            isReadOnly
            w="80%"
            maxW="200px"
            value={insertStr(items.value)}
            onClick={() => handleClick(items.recodeId, items.value)}
          />
        )}
      </Flex>
    </>
  );
};

export default PracticeEditRecode;
