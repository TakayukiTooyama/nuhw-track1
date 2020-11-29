import React, { FC } from 'react';
import { Menu, Recode } from '../../models/users';
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import EditInput from '../moleclus/EditInput';

type Props = {
  items: Menu;
};

const EditMenuList: FC<Props> = ({ items }) => {
  const [recodes, setRecodes] = useState<Recode[]>(items.recodes);
  const [recode, setRecode] = useState('');
  const [addToggle, setAddToggle] = useState(false);
  const [editToggle, setEditToggle] = useState(false);
  const [index, setIndex] = useState(0);

  //新しく追加するための入力処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecode(e.target.value);
  };

  //記録の編集処理
  const updateRecode = (
    e: React.KeyboardEvent<HTMLElement>,
    index: number,
    value: string
  ) => {
    if (e.key === 'Enter') {
      const newRecodes = recodes;
      recodes[index] = { recodeId: index, value };
      setRecodes(newRecodes);
      setEditToggle(false);
      setIndex(recodes.length);
      setRecode('');
    }
  };

  //新しく記録を追加するための処理
  const addRecode = (e: React.KeyboardEvent<HTMLElement>, idx: number) => {
    if (e.key === 'Enter') {
      if (recode === '') return;
      const newRecode = { recodeId: index, value: recode };
      setRecodes((prev) => [...prev, newRecode]);
      setIndex(idx + 1);
      setRecode('');
    }
  };

  //編集を離れて場合 or 変更後の処理
  const handleBlur = () => {
    setAddToggle(false);
    setRecode('');
  };

  //編集への切り替え(recodeクリック時の処理)
  const handleClick = (index: number, value: string) => {
    setRecode(value);
    setIndex(index);
    setEditToggle(true);
  };

  //リフレッシュ後でもインデックスを続きから始めるための処理
  useEffect(() => {
    setIndex(recodes.length);
  }, [recodes.length]);

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
      <Stack spacing={1}>
        {recodes.map((item, idx) => (
          <Flex key={`recode-${idx}-${item.value}`} align="center">
            <Text color="gray.400" mx={2}>{`${idx + 1}本目`}</Text>
            {editToggle ? (
              <EditInput
                value={item.value}
                id={item.recodeId}
                updateRecode={updateRecode}
                setEditToggle={setEditToggle}
              />
            ) : (
              <Input
                isReadOnly
                w="80%"
                maxW="200px"
                defaultValue={insertStr(item.value)}
                onClick={() => handleClick(idx, item.value)}
              />
            )}
          </Flex>
        ))}
      </Stack>
      <Box mb={4}></Box>
      <HStack spacing={1}>
        {addToggle ? (
          <Input
            autoFocus
            maxW="200px"
            value={recode}
            placeholder={`${index + 1}本目`}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => addRecode(e, index)}
          />
        ) : (
          <>
            <Button w="98px" onClick={() => setAddToggle(true)}>
              ＋
            </Button>
            <Button w="98px" bg="orange.400" color="white">
              保存
            </Button>
          </>
        )}
      </HStack>
    </>
  );
};

export default EditMenuList;
