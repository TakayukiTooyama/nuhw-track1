import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  PinInput,
  PinInputField,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useState,
} from 'react';
import { useRecoilValue } from 'recoil';

import { db } from '../../../lib/firebase';
import { TournamentRecode, TournamentMenu, Round } from '../../../models/users';
import { userState } from '../../../recoil/users/user';
import { ErrorMessage } from '../../molecules';

type Props = {
  index: number;
  menuId: string;
  recodes: TournamentRecode[];
  menu: TournamentMenu;
  setIndex: Dispatch<SetStateAction<number>>;
  setRecodes: Dispatch<SetStateAction<TournamentRecode[]>>;
  toggleEdit: boolean;
  setToggleEdit: Dispatch<SetStateAction<boolean>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

const TournamentRecodeCreator: FC<Props> = ({
  index,
  menuId,
  recodes,
  menu,
  setIndex,
  setRecodes,
  toggleEdit,
  setToggleEdit,
  errorMessage,
  setErrorMessage,
}) => {
  //Global State
  const user = useRecoilValue(userState);

  //Local State
  //ラウンド
  const [round, setRound] = useState<Round>('予選');
  //記録
  const [recode, setRecode] = useState('');
  //風速
  const [wind, setWind] = useState('');
  const [loading, setLoading] = useState(false);
  const [lane, setLane] = useState('1');

  const roundList: Round[] = ['予選', '準決勝', '決勝'];

  //大会結果を追加
  const addRecode = async () => {
    if (user === null) return;
    const tournamentsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('tournaments')
      .doc(menuId);

    const validation =
      menu.competitionName !== '400M' &&
      menu.competitionName !== '400H' &&
      menu.competitionName !== '800M';
    //全て入力
    if (recode === '' || (validation && wind === '')) {
      setErrorMessage('全ての項目を入力してください');
      return;
    }
    //風速-9.9 ~ 9.9以内かつ小数点第一位まで入力
    if (
      (validation && wind.slice(0, 1) === '-' && wind.length > 4) ||
      (validation && wind.slice(0, 1) !== '-' && wind.length > 3) ||
      (validation && wind.slice(-2, -1) !== '.')
    ) {
      setErrorMessage('2.0 or -2.0の形で入力してください');
      return;
    }
    //10分以内(800mまでなので10分以上かからない)
    const regex1 = /[^0-9]/g;
    const regex2 = /[^0-9.-]/g;
    const resultRecode = regex1.test(recode);
    const resultWind = regex2.test(wind);
    const currentWind = regex1.test(wind.slice(-3, -2));
    if (
      recode.length > 5 ||
      resultRecode ||
      resultWind ||
      currentWind ||
      (wind.slice(0, 1) === '-' && wind.slice(-3, -2) === '0') ||
      recode.slice(0, 1) === '0'
    ) {
      setErrorMessage('正しい記録を入力してください');
      return;
    }
    setLoading(true);

    const newData: TournamentRecode = {
      recodeId: index,
      round,
      value: recode,
      wind,
      lane,
    };
    await tournamentsRef.update({ recodes: [...recodes, newData] }).then(() => {
      setRecodes((prev) => [...prev, newData]);
      setRecode('');
      setRound('予選');
      setWind('');
      setLane('1');
      setIndex((prev) => prev + 1);
      setLoading(false);
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    setValue: Dispatch<SetStateAction<string>>
  ) => {
    setValue(e.target.value);
    setErrorMessage('');
  };

  const cansel = () => {
    setToggleEdit(false);
    setRound('予選');
    setLane('1');
    setRecode('');
    setWind('');
    setErrorMessage('');
  };

  return (
    <HStack>
      {toggleEdit ? (
        <Flex direction="column">
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
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
            <Input
              maxW="200px"
              value={recode}
              onChange={(e) => handleChange(e, setRecode)}
              placeholder="記録"
            />
            {menu.competitionName !== '400M' &&
            menu.competitionName !== '800M' &&
            menu.competitionName !== '400H' ? (
              <Input
                maxW="200px"
                value={wind}
                onChange={(e) => handleChange(e, setWind)}
                placeholder="風速"
              />
            ) : null}
            <ErrorMessage message={errorMessage} />
            <HStack>
              <Button
                shadow="base"
                bg="green.300"
                w="100%"
                maxW="100px"
                onClick={addRecode}
                isLoading={loading}
              >
                追加
              </Button>
              <Button shadow="base" onClick={cansel}>
                キャンセル
              </Button>
            </HStack>
          </Stack>
        </Flex>
      ) : (
        <Button w="200px" shadow="base" onClick={() => setToggleEdit(true)}>
          ＋
        </Button>
      )}
    </HStack>
  );
};

export default TournamentRecodeCreator;
