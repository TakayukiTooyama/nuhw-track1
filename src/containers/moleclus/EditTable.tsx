import { Flex, Input, Text } from '@chakra-ui/react';
import { FC, useState } from 'react';
import { Recode } from '../../models/users';

type Props = {
  idx: number;
  index: number;
  items: Recode;
  recodes: Recode[];
  setRecodes: React.Dispatch<React.SetStateAction<Recode[]>>;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setSaveToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditTable: FC<Props> = ({
  items,
  idx,
  index,
  recodes,
  setRecodes,
  setIndex,
  setSaveToggle,
}) => {
  const [recode, setRecode] = useState(items.value),
    [isComposed, setIsComposed] = useState(false),
    [editToggle, setEditToggle] = useState(items.editting);

  const updateRecodePressEnter = (e: React.KeyboardEvent<HTMLElement>) => {
    if (isComposed) return;
    updateRecode(e, items.recodeId, recode);
  };

  //新しく追加するための入力処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecode(e.target.value);
    console.log('hello');
    setSaveToggle(false);
  };

  //記録の編集処理
  const updateRecode = (
    e: React.KeyboardEvent<HTMLElement>,
    index: number,
    value: string
  ) => {
    if (e.key === 'Enter') {
      const newRecodes = recodes;
      recodes[index] = { recodeId: index, value, editting: false };
      setRecodes(newRecodes);
      setEditToggle(false);
      setIndex(recodes.length);
      setRecode('');
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

  //最初に0が着いていたら削除
  const replaceZero = (input: string) => {
    const firstIndex = input.slice(0, 1);
    if (firstIndex === '0') {
      return firstIndex.replace('0', '') + input.slice(1, input.length);
    }
    return input;
  };

  //入力された文字列をタイム表記に変換
  const insertStr = (input: string) => {
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
            onKeyDown={(e) => updateRecodePressEnter(e)}
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

export default EditTable;
