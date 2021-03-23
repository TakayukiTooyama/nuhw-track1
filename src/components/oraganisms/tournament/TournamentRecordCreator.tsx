import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  PinInput,
  PinInputField,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { db } from '../../../lib/firebase';
import { Round, TournamentMenu, TournamentRecord } from '../../../models/users';
import { userState } from '../../../recoil/users/user';
import { ErrorMessage, InputNumber } from '../../molecules';

type Props = {
  index: number;
  menuId: string;
  records: TournamentRecord[];
  menu: TournamentMenu;
  setIndex: Dispatch<SetStateAction<number>>;
  setRecords: Dispatch<SetStateAction<TournamentRecord[]>>;
  toggleEdit: boolean;
  setToggleEdit: Dispatch<SetStateAction<boolean>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

const TournamentRecordCreator: FC<Props> = ({
  index,
  menuId,
  records,
  menu,
  setIndex,
  setRecords,
  toggleEdit,
  setToggleEdit,
  errorMessage,
  setErrorMessage,
}) => {
  // Global State
  const user = useRecoilValue(userState);

  // Local State
  // ラウンド
  const [round, setRound] = useState<Round>('予選');
  // 記録
  const [record, setRecord] = useState('');
  // 風速
  const [wind, setWind] = useState('');
  const [loading, setLoading] = useState(false);
  const [lane, setLane] = useState('1');

  const roundList: Round[] = ['予選', '準決勝', '決勝'];

  // 大会結果を追加
  const addRecord = async () => {
    if (user === null) return;
    const usersRef = db.collection('users').doc(user.uid);
    const tournamentsRef = usersRef.collection('tournaments').doc(menuId);

    const validation =
      menu.competitionName !== '400M' &&
      menu.competitionName !== '400H' &&
      menu.competitionName !== '800M';
    // 全て入力
    if (record === '' || (validation && wind === '')) {
      setErrorMessage('全ての項目を入力してください');
      return;
    }
    // 風速-9.9 ~ 9.9以内かつ小数点第一位まで入力
    if (
      (validation && wind.slice(0, 1) === '-' && wind.length > 4) ||
      (validation && wind.slice(0, 1) !== '-' && wind.length > 3) ||
      (validation && wind.slice(-2, -1) !== '.')
    ) {
      setErrorMessage('2.0 or -2.0の形で入力してください');
      return;
    }
    // 10分以内(800mまでなので10分以上かからない)
    const regex1 = /[^0-9]/g;
    const regex2 = /[^0-9.-]/g;
    const resultRecord = regex1.test(record);
    const resultWind = regex2.test(wind);
    const currentWind = regex1.test(wind.slice(-3, -2));
    if (
      record.length > 5 ||
      resultRecord ||
      resultWind ||
      currentWind ||
      (wind.slice(0, 1) === '-' && wind.slice(-3, -2) === '.') ||
      record.slice(0, 1) === '0'
    ) {
      setErrorMessage('正しい記録を入力してください');
      return;
    }
    setLoading(true);

    const newData: TournamentRecord = {
      recordId: index,
      round,
      value: record,
      wind,
      lane,
    };
    await tournamentsRef
      .update({ records: [...records, newData] })
      .then(async () => {
        setRecords((prev) => [...prev, newData]);
        setRecord('');
        setRound('予選');
        setWind('');
        setLane('1');
        setIndex((prev) => prev + 1);
        setLoading(false);
      });
  };

  const handleChangeRecord = (valueAsString: string) => {
    setRecord(valueAsString);
    setErrorMessage('');
  };
  const handleChangeWind = (valueAsString: string) => {
    setWind(valueAsString);
    setErrorMessage('');
  };

  const cansel = () => {
    setToggleEdit(false);
    setRound('予選');
    setLane('1');
    setRecord('');
    setWind('');
    setErrorMessage('');
  };

  return (
    <>
      {toggleEdit ? (
        <Flex direction="column" w="100%" maxW="255px">
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              shadow="base"
            >
              {round}
            </MenuButton>
            <MenuList>
              {roundList.map((round) => (
                <MenuItem key={round} onClick={() => setRound(round)}>
                  {round}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Box mb={2} />
          <Stack spacing={2}>
            {menu.competitionName !== '800M' ? (
              <Flex justify="flex-start" align="center">
                <PinInput value={lane} onChange={(value) => setLane(value)}>
                  <PinInputField />
                </PinInput>
                <Text color="gray.400">レーン</Text>
              </Flex>
            ) : null}
            <InputNumber
              value={record}
              inputMode="numeric"
              onChange={handleChangeRecord}
              placeholder="記録"
            />
            {menu.competitionName !== '400M' &&
            menu.competitionName !== '800M' &&
            menu.competitionName !== '400H' ? (
              <InputNumber
                value={wind}
                inputMode="decimal"
                type="text"
                step={0.1}
                onChange={handleChangeWind}
                placeholder="風速"
              />
            ) : null}
            <ErrorMessage message={errorMessage} textAlign="center" />
            <HStack maxW="255px">
              <Button
                w="100%"
                shadow="base"
                colorScheme="teal"
                onClick={addRecord}
                isLoading={loading}
              >
                追加
              </Button>
              <Button shadow="base" w="100%" onClick={cansel}>
                閉じる
              </Button>
            </HStack>
          </Stack>
        </Flex>
      ) : (
        <Button w="255px" shadow="base" onClick={() => setToggleEdit(true)}>
          ＋
        </Button>
      )}
    </>
  );
};

export default TournamentRecordCreator;
