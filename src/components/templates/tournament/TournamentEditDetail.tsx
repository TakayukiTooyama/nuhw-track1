import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  PinInput,
  PinInputField,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import moment from 'moment';

import {
  isComposedState,
  makedMenuNameListState,
  selectedTournamentDataState,
  userAuthState,
  userInfoState,
} from '../../../recoil/users/user';
import { db } from '../../../lib/firebase';
import { TournamentData, TournamentMenu } from '../../../models/users';
import { TournamentEditMenu, TournamentHeader } from '../../oraganisms';
import Router from 'next/router';

const TournamentEditDetail: FC = () => {
  //Global State
  const user = useRecoilValue(userAuthState);
  const userInfo = useRecoilValue(userInfoState);
  const selectedData = useRecoilValue(selectedTournamentDataState);
  const [isComposed, setIsComposed] = useRecoilState(isComposedState);
  const [nameList, setNameList] = useRecoilState(makedMenuNameListState);

  //Local State
  const [toggleMenu, setToggleMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  //大会種目名
  const [name, setName] = useState('');
  //大会種目以外を入力した時のエラーメッセージ
  const [errorMessage, setErrorMessage] = useState('');
  //何日目に行われるのか
  const [day, setDay] = useState('1');

  //Local State
  const [menus, setMenus] = useState<TournamentMenu[]>([]);
  const [dataList, setDataList] = useState<TournamentData[]>([]);

  const format = (date: Date | string, format: string) => {
    return moment(date).format(format);
  };

  //今日の日付(2020年12月1日 → 20201201)
  const today = Number(format(new Date(), 'YYYYMMDD'));
  //一年前
  const year = today - 10000;

  useEffect(() => {
    fetchYearData();
    fetchTournamentData();
  }, [userInfo]);

  //一年分の大会結果を取得
  const fetchYearData = async () => {
    if (user === null) return;
    const tournamentsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('tournaments')
      .where('competitionDay', '>=', year);
    await tournamentsRef.get().then((snapshot) => {
      let menuData: TournamentMenu[] = [];
      let nameList: string[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as TournamentMenu;
        const name = data.competitionName;
        menuData.push(data);
        nameList.push(name);
      });
      const DeduplicationNameList = [...new Set(nameList)];
      setNameList(DeduplicationNameList);
      setMenus(menuData);
    });
  };

  //出場した大会を取得
  const fetchTournamentData = async () => {
    if (userInfo === null) return;
    const tournamentMenusRef = db
      .collection('teams')
      .doc(userInfo.teamInfo.teamId)
      .collection('tournamentMenus');
    await tournamentMenusRef.get().then((snapshot) => {
      const dataList: TournamentData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as TournamentData;
        userInfo.tournamentIds.map((id) => {
          if (id === data.id) {
            dataList.push(data);
          }
        });
      });
      setDataList(dataList);
    });
  };

  //大会日数
  const period =
    moment(selectedData.endDate, 'YYYYMMDD').diff(
      moment(selectedData.startDate, 'YYYYMMDD'),
      'days'
    ) + 1;

  //種目ごとの競技日
  const eventDate = Number(
    moment(selectedData.startDate, 'YYYYMMDD')
      .add(Number(day) - 1, 'days')
      .format('YYYYMMDD')
  );

  //大会名と競技日が一致しているものだけにする
  const filterMenus = menus.filter(
    (menu: TournamentMenu) =>
      menu.data.name === selectedData.name && menu.competitionDay === eventDate
  );

  //ハードルかそうではないか判定し、語尾を変える
  const formatName = (name: string) => {
    const jdgeName = name.slice(-1);
    if (jdgeName !== 'H') {
      return `${name}M`;
    } else {
      return name;
    }
  };

  //大会種目の追加処理
  const addMenu = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      if (isComposed) return;
      if (name === '') {
        setErrorMessage('練習メニューを登録してください');
        return;
      }
      if (
        name !== '100' &&
        name !== '200' &&
        name !== '400' &&
        name !== '800' &&
        name !== '100H' &&
        name !== '110H' &&
        name !== '400H'
      ) {
        setErrorMessage('大会種目を正確に入力してください。');
        return;
      }
      if (selectedData.name === '選択してください') {
        setErrorMessage('大会を先に選んでください');
        return;
      }
      if (user === null) return;
      if (userInfo === null) return;
      setLoading(true);
      const usersRef = db.collection('users').doc(user.uid);
      const practicesRef = usersRef.collection('tournaments');
      const menuId = practicesRef.doc().id;
      const newData: TournamentMenu = {
        menuId,
        competitionName: formatName(name),
        competitionDay: eventDate,
        data: selectedData,
        recodes: [],
      };
      await practicesRef
        .doc(menuId)
        .set(newData)
        .then(() => {
          setMenus((prev) => [...prev, newData]);

          /*
            同じ大会で同じ種目に出る可能性があるので作成した種目を
            どんどん選択肢に入れると被りが出てしまうためそれを防ぐ
          */
          let deduplicationNameList: string[] = [];
          nameList.forEach((item) => {
            if (item !== formatName(name)) {
              deduplicationNameList.push(item);
            }
          });
          setNameList([...deduplicationNameList, formatName(name)]);
          successFnc();
        });
    }
  };

  const successFnc = async () => {
    if (user === null) return;
    if (userInfo === null) return;
    const usersRef = db.collection('users').doc(user.uid);
    const newId = selectedData.id;
    const judg = userInfo.tournamentIds.every((id) => {
      return id !== newId;
    });
    if (judg) {
      await usersRef
        .update({ tournamentIds: [...userInfo.tournamentIds, newId] })
        .then(() => {
          setToggleMenu(false);
          setName('');
          setLoading(false);
        });
    } else {
      setToggleMenu(false);
      setName('');
      setLoading(false);
    }
  };

  //大会種目の削除処理
  const deleteMenu = async (menuId: string) => {
    if (user === null) return;
    const tournamentsRef = db
      .collection('users')
      .doc(user.uid)
      .collection('tournaments')
      .doc(menuId);
    await tournamentsRef.delete().then(() => {
      const newMenus = menus.filter((menu) => menu.menuId !== menuId);
      setMenus(newMenus);
    });
  };

  //入力処理を離れる時の処理
  const handleBlur = () => {
    setToggleMenu(false);
    setName('');
    setErrorMessage('');
  };

  //0日目と大会期間以外を入力できないように
  const handleChangeDay = (value: string) => {
    if (value === '0') return;
    if (Number(value) > period) return;
    setDay(value);
  };

  return (
    <>
      <TournamentHeader dataList={dataList} />
      <Flex justify="space-between" align="center">
        <Flex justify="flex-start" align="center">
          <PinInput value={`${day}`} onChange={handleChangeDay}>
            <PinInputField mr={1} bg="white" />
          </PinInput>
          <Text fontSize="lg">日目</Text>
        </Flex>
        <Button
          size="sm"
          shadow="base"
          onClick={() => Router.push('/tournament')}
        >
          終了
        </Button>
      </Flex>

      {filterMenus.map((menu) => (
        <TournamentEditMenu
          key={menu.menuId}
          items={menu}
          deleteMenu={deleteMenu}
        />
      ))}
      {toggleMenu ? (
        <>
          {loading ? (
            <Stack bg="white" shadow="base" p={4}>
              <Skeleton height="40px" />
              <Skeleton height="40px" />
            </Stack>
          ) : (
            <>
              <Input
                autoFocus
                bg="white"
                placeholder="種目 (例 100, 400H)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={addMenu}
                onCompositionStart={() => setIsComposed(true)}
                onCompositionEnd={() => setIsComposed(false)}
              />
              <Box mb={1}></Box>
              <Text color="red.400">{errorMessage}</Text>
            </>
          )}
        </>
      ) : (
        <Button shadow="base" onClick={() => setToggleMenu(true)}>
          メニューを追加
        </Button>
      )}
    </>
  );
};

export default TournamentEditDetail;
