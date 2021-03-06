import { ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  PinInput,
  PinInputField,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { db } from '../../../lib/firebase';
import { Round, TournamentMenu, TournamentRecord } from '../../../models/users';
import { userState } from '../../../recoil/users/user';
import { formatTimeNotationAtInput } from '../../../utils/formatTimeNotationAtInput';
import { ErrorMessage, InputNumber } from '../../molecules';
import InputBox from '../../molecules/common/InputBox';

type Props = {
  menuId: string;
  items: TournamentRecord;
  records: TournamentRecord[];
  menu: TournamentMenu;
  setRecords: Dispatch<SetStateAction<TournamentRecord[]>>;
  setIndex: Dispatch<SetStateAction<number>>;
  setToggleEdit: Dispatch<SetStateAction<boolean>>;
};

const TournamentEditRecord: FC<Props> = ({
  items,
  menuId,
  records,
  menu,
  setRecords,
  setIndex,
  setToggleEdit,
}) => {
  // Global State
  const user = useRecoilValue(userState);

  // Local State
  const [round, setRound] = useState(items.round);
  const [record, setRecord] = useState(items.value);
  const [wind, setWind] = useState(items.wind);
  const [lane, setLane] = useState(items.lane);
  const [toggleRecords, setToggleRecords] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 記録の編集処理
  const updateRecord = async (
    round: Round,
    value: string,
    wind: string,
    lane: string
  ) => {
    if (user === null) return;
    const weightsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('tournaments')
      .doc(menuId);
    const newRecords = records;
    records[items.recordId] = {
      recordId: items.recordId,
      round,
      value,
      wind,
      lane,
    };
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
    const regex = /[^0-9]/g;
    const result = regex.test(record);
    if (record.length > 5 || result || record.slice(0, 1) === '0') {
      setErrorMessage('正しい記録を入力してください');
      return;
    }
    await weightsRef.update({ records: newRecords }).then(() => {
      setRecords(newRecords);
      setToggleRecords(false);
      setIndex(records?.length);
      setRound('予選');
      setRecord('');
      setWind('');
      setLane('1');
    });
  };

  // 編集への切り替え(Recordクリック時の処理)
  const handleClick = () => {
    setRound(items.round);
    setRecord(items.value);
    setWind(items.wind);
    setLane(items.lane);
    setIndex(items.recordId);
    setToggleEdit(false);
    const selectedIndex = records.findIndex(
      (record) => record.recordId === items.recordId
    );
    records[selectedIndex] = {
      recordId: items.recordId,
      round: items.round,
      value: items.value,
      wind: items.wind,
      lane: items.lane,
    };
    setRecords(records);
    setToggleRecords(true);
  };

  // 編集を離れた時
  const handleBlur = () => {
    const selectedIndex = records.findIndex(
      (record) => record.recordId === items.recordId
    );
    records[selectedIndex] = {
      recordId: items.recordId,
      value: items.value,
      round: items.round,
      wind: items.wind,
      lane: items.lane,
    };
    setToggleRecords(false);
    setRecords(records);
  };

  const roundList: Round[] = ['予選', '準決勝', '決勝'];

  const changeRecord = (valueAsString: string) => {
    setRecord(valueAsString);
    setErrorMessage('');
  };
  const changeWind = (valueAsString: string) => {
    setWind(valueAsString);
    setErrorMessage('');
  };

  // 大会結果削除
  const deleteRecord = async (id: number) => {
    if (user === null) return;
    const tournamentsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('tournaments')
      .doc(menuId);
    const newRecords = records.filter((record) => record.recordId !== id);
    await tournamentsRef.update({ records: newRecords }).then(() => {
      setRecords(newRecords);
    });
  };

  return (
    <>
      {toggleRecords ? (
        <>
          <Flex direction="column">
            <HStack mb={2} w="100%" maxW="255px">
              <Menu>
                <MenuButton
                  w="100%"
                  shadow="base"
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
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
              <IconButton
                aria-label="menu-delete"
                shadow="inner"
                bg="red.200"
                onClick={() => deleteRecord(items.recordId)}
                icon={<DeleteIcon />}
              />
            </HStack>
            {menu.competitionName !== '800M' ? (
              <Flex justify="flex-start" align="center">
                <PinInput
                  defaultValue="1"
                  value={lane}
                  onChange={(value) => setLane(value)}
                >
                  <PinInputField />
                </PinInput>
                <Text color="gray.400">レーン</Text>
              </Flex>
            ) : null}
            <Box mb={2} />
            <Stack>
              <InputNumber
                value={record}
                inputMode="numeric"
                onChange={changeRecord}
                placeholder="記録"
              />
              {menu.competitionName !== '400M' &&
              menu.competitionName !== '800M' &&
              menu.competitionName !== '400H' ? (
                <InputNumber
                  value={wind}
                  inputMode="decimal"
                  step={0.1}
                  onChange={changeWind}
                  placeholder="風速"
                />
              ) : null}
            </Stack>
            <Box mb={2} />
            <ErrorMessage message={errorMessage} />
            <Box mb={2} />
            <HStack maxW="255px">
              <Button
                w="100%"
                shadow="base"
                colorScheme="teal"
                onClick={() => updateRecord(round, record, wind, lane)}
              >
                更新
              </Button>
              <Button shadow="base" w="100%" onClick={handleBlur}>
                閉じる
              </Button>
            </HStack>
            <Box mb={4} />
          </Flex>
        </>
      ) : (
        <Box
          onClick={handleClick}
          w="100%"
          maxW="255px"
          border="1px solid"
          borderColor="inherit"
          borderRadius="0.375rem"
          cursor="pointer"
        >
          <Flex>
            <InputBox
              bg="gray.100"
              value={items.round}
              textAlign="center"
              borderRadius="none"
              borderstyle="none"
            />
            {menu.competitionName !== '800M' ? (
              <InputBox
                bg="gray.100"
                value={`${items.lane}レーン`}
                textAlign="center"
                borderRadius="none"
                borderstyle="none"
              />
            ) : null}
          </Flex>
          <Flex>
            <InputBox
              value={formatTimeNotationAtInput(items.value)}
              textAlign="center"
              borderRadius="none"
              borderstyle="none"
            />
            {menu.competitionName !== '400M' &&
            menu.competitionName !== '800M' &&
            menu.competitionName !== '400H' ? (
              <InputBox
                value={items.wind}
                textAlign="center"
                borderRadius="none"
                borderstyle="none"
              />
            ) : null}
          </Flex>
        </Box>
      )}
    </>
  );
};

export default TournamentEditRecord;
