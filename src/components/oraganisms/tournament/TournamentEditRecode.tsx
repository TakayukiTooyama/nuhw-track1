import { FC, useState, Dispatch, SetStateAction, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
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

import { Round, TournamentMenu, TournamentRecode } from '../../../models/users';
import { useRecoilValue } from 'recoil';
import { userAuthState } from '../../../recoil/users/user';
import { db } from '../../../lib/firebase';
import { insertStr } from '../practice/PracticeEditRecode';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { AiFillDelete } from 'react-icons/ai';

type Props = {
  menuId: string;
  items: TournamentRecode;
  recodes: TournamentRecode[];
  menu: TournamentMenu;
  setRecodes: Dispatch<SetStateAction<TournamentRecode[]>>;
  setIndex: Dispatch<SetStateAction<number>>;
  setToggleEdit: Dispatch<SetStateAction<boolean>>;
};

const TournamentEditRecode: FC<Props> = ({
  items,
  menuId,
  recodes,
  menu,
  setRecodes,
  setIndex,
  setToggleEdit,
}) => {
  //Global State
  const user = useRecoilValue(userAuthState);

  //Local State
  const [round, setRound] = useState(items.round);
  const [recode, setRecode] = useState(items.value);
  const [wind, setWind] = useState(items.wind);
  const [lane, setLane] = useState(items.lane);
  const [toggleRecodes, setToggleRecodes] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  //記録の編集処理
  const updateRecode = async (
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
    const newRecodes = recodes;
    recodes[items.recodeId] = {
      recodeId: items.recodeId,
      round,
      value,
      wind,
      lane,
    };
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
    const regex = /[^0-9]/g;
    const result = regex.test(recode);
    if (recode.length > 5 || result || recode.slice(0, 1) === '0') {
      setErrorMessage('正しい記録を入力してください');
      return;
    }
    await weightsRef.update({ recodes: newRecodes }).then(() => {
      setRecodes(newRecodes);
      setToggleRecodes(false);
      setIndex(recodes.length);
      setRound('予選');
      setRecode('');
      setWind('');
      setLane('1');
    });
  };

  //編集への切り替え(recodeクリック時の処理)
  const handleClick = () => {
    setRound(items.round);
    setRecode(items.value);
    setWind(items.wind);
    setLane(items.lane);
    setIndex(items.recodeId);
    setToggleEdit(false);
    const selectedIndex = recodes.findIndex(
      (recode) => recode.recodeId === items.recodeId
    );
    recodes[selectedIndex] = {
      recodeId: items.recodeId,
      round: items.round,
      value: items.value,
      wind: items.wind,
      lane: items.lane,
    };
    setRecodes(recodes);
    setToggleRecodes(true);
  };

  //編集を離れた時
  const handleBlur = () => {
    const selectedIndex = recodes.findIndex(
      (recode) => recode.recodeId === items.recodeId
    );
    recodes[selectedIndex] = {
      recodeId: items.recodeId,
      value: items.value,
      round: items.round,
      wind: items.wind,
      lane: items.lane,
    };
    setToggleRecodes(false);
    setRecodes(recodes);
  };

  const roundList: Round[] = ['予選', '準決勝', '決勝'];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    setValue: Dispatch<SetStateAction<string>>
  ) => {
    setValue(e.target.value);
    setErrorMessage('');
  };

  //大会結果削除
  const deleteRecode = async (id: number) => {
    if (user === null) return;
    const tournamentsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('tournaments')
      .doc(menuId);
    const newRecodes = recodes.filter((recode) => recode.recodeId !== id);
    await tournamentsRef.update({ recodes: newRecodes }).then(() => {
      setRecodes(newRecodes);
    });
  };

  return (
    <>
      {toggleRecodes ? (
        <>
          <Flex direction="column">
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                w="100%"
                maxW="200px"
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
            <Box mb={2}></Box>
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
            <Box mb={2}></Box>
            <Stack>
              <Input
                w="80%"
                maxW="200px"
                value={recode}
                onChange={(e) => handleChange(e, setRecode)}
              />
              {menu.competitionName !== '400M' &&
              menu.competitionName !== '800M' &&
              menu.competitionName !== '400H' ? (
                <Input
                  autoFocus
                  w="80%"
                  maxW="200px"
                  value={wind}
                  onChange={(e) => handleChange(e, setWind)}
                />
              ) : null}
            </Stack>
            <Box mb={2}></Box>
            <Text color="red.300" fontWeight="bold">
              {errorMessage}
            </Text>
            <Box mb={2}></Box>
            <HStack>
              <Button
                bg="green.300"
                shadow="base"
                w="100%"
                maxW="100px"
                onClick={() => updateRecode(round, recode, wind, lane)}
              >
                更新
              </Button>
              <Button shadow="base" w="100%" maxW="100px" onClick={handleBlur}>
                キャンセル
              </Button>
              <IconButton
                aria-label="menu-delete"
                shadow="inner"
                bg="red.300"
                onClick={() => deleteRecode(items.recodeId)}
              >
                <AiFillDelete fontSize="20px" />
              </IconButton>
            </HStack>
          </Flex>
        </>
      ) : (
        <Box onClick={handleClick}>
          <Input
            isReadOnly
            value={items.round}
            textAlign="center"
            w="100%"
            maxW="100px"
            rounded="0"
          />
          {menu.competitionName !== '800M' ? (
            <Input
              isReadOnly
              value={`${items.lane}レーン`}
              textAlign="center"
              w="100%"
              maxW="100px"
              rounded="0"
            />
          ) : null}
          <Input
            isReadOnly
            value={insertStr(items.value)}
            textAlign="center"
            w="100%"
            maxW="100px"
            rounded="0"
          />
          {menu.competitionName !== '400M' &&
          menu.competitionName !== '800M' &&
          menu.competitionName !== '400H' ? (
            <Input
              isReadOnly
              value={items.wind}
              textAlign="center"
              w="100%"
              maxW="100px"
              rounded="0"
            />
          ) : null}
        </Box>
      )}
    </>
  );
};

export default TournamentEditRecode;
