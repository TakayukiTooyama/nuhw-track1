import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { db } from '../../../lib/firebase';
import { fetchTournamentMenu } from '../../../lib/firestore/teams';
import { TournamentData } from '../../../models/users';
import { userState } from '../../../recoil/users/user';
import { DateRangePicker, Heading1, LinkButton } from '../../molecules';
import { MenuDeleteModal } from '../../oraganisms';

const CreateTournamentMenuDetail: FC = () => {
  // moment.js
  const date = moment().toDate();

  // Global State
  const user = useRecoilValue(userState);

  // Local State
  const [menus, setMenus] = useState<TournamentData[]>([]);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [toggleEditMenu, setToggleEditMenu] = useState(false);
  const [name, setName] = useState('');
  const [venue, setVenue] = useState('');
  const [startDate, setStartDate] = useState(date);
  const [endDate, setEndDate] = useState(date);
  const [selectedIndex, setSelectedIndex] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();

  const formatStartDate = moment(startDate).format('YYYYMMDD');
  const formatEndDate = moment(endDate).format('YYYYMMDD');

  useEffect(() => {
    fetchTournamentMenu(user, setMenus);
  }, [user]);

  // //チーム内の大会リストに新しく追加する処理
  const addTournamentMenu = async () => {
    if (user === null) return;
    if (name === '' || venue === '') return;
    const tournamentsRef = db
      .collection('teams')
      .doc(user.teamInfo.teamId)
      .collection('tournamentMenus');
    const { id } = tournamentsRef.doc();
    const newData: TournamentData = {
      id,
      name,
      venue,
      startDate: formatStartDate,
      endDate: formatEndDate,
    };
    await tournamentsRef
      .doc(id)
      .set(newData, { merge: true })
      .then(() => {
        setMenus((prev) => [...prev, newData]);
        setToggleEdit(false);
        setName('');
        setVenue('');
        setStartDate(date);
        setEndDate(new Date());
      });
  };

  // チーム内の大会リストを編集する処理
  const editTournamentMenu = async (id: string, idx: number) => {
    if (user === null) return;
    const tournamentsRef = db
      .collection('teams')
      .doc(user.teamInfo.teamId)
      .collection('tournamentMenus');
    await tournamentsRef
      .doc(id)
      .update({ name, venue, startDate, endDate })
      .then(() => {
        menus[idx] = {
          id,
          name,
          venue,
          startDate: formatStartDate,
          endDate: formatEndDate,
        };
        setMenus(menus);
        setToggleEditMenu(false);
        setName('');
        setVenue('');
        setStartDate(new Date());
        setEndDate(new Date());
      });
  };

  // チーム内の大会リストを削除する処理
  const deleteTournamentMenu = async (id: string) => {
    if (user === null) return;
    const tournamentsRef = db
      .collection('teams')
      .doc(user.teamInfo.teamId)
      .collection('tournamentMenus')
      .doc(id);

    await tournamentsRef.delete().then(() => {
      const newTournamentMenu = menus.filter((item) => item.id !== id);
      setMenus(newTournamentMenu);
    });
  };

  // 大会リストの編集のためにそれぞれをクリックした時の処理
  const handleClick = (menu: TournamentData) => {
    const editStartDate = new Date(
      `${menu.startDate.slice(0, 4)}/${menu.startDate.slice(
        4,
        6
      )}/${menu.startDate.slice(6, 8)}`
    );
    const editEndDate = new Date(
      `${menu.endDate.slice(0, 4)}/${menu.endDate.slice(
        4,
        6
      )}/${menu.endDate.slice(6, 8)}`
    );
    setToggleEdit(false);
    setName(menu.name);
    setVenue(menu.venue);
    setStartDate(editStartDate);
    setEndDate(editEndDate);
    setSelectedIndex(menu.id);
    setToggleEditMenu(true);
  };

  const cansel = () => {
    setToggleEditMenu(false);
    setName('');
    setVenue('');
    setStartDate(new Date());
    setEndDate(new Date());
  };

  return (
    <div>
      <Flex justify="space-between" align="center">
        <Heading1 label="大会追加" />
        <LinkButton label="戻る" link="/tournament/search" />
      </Flex>
      <Box mb={8} />
      {/* 追加された大会 */}
      {menus.length > 0 && (
        <>
          <Divider />
          {menus.map((menu, idx) => {
            if (toggleEditMenu && selectedIndex === menu.id) {
              return (
                <Stack key={menu.id} my={4}>
                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                  />
                  <Input
                    bg="white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    bg="white"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                  />
                  <HStack>
                    <Button
                      w="100%"
                      colorScheme="teal"
                      shadow="base"
                      onClick={() => editTournamentMenu(menu.id, idx)}
                    >
                      更新
                    </Button>
                    <Button
                      w="100%"
                      colorScheme="red"
                      shadow="base"
                      onClick={onOpen}
                    >
                      削除
                    </Button>
                    <Button shadow="base" w="100%" onClick={cansel}>
                      閉じる
                    </Button>
                  </HStack>
                  <MenuDeleteModal
                    title={menu.name}
                    isOpen={isOpen}
                    onClose={onClose}
                    onDelete={() => deleteTournamentMenu(menu.id)}
                  />
                </Stack>
              );
            }
            return (
              <Box
                key={menu.id}
                h="40px"
                bg="white"
                lineHeight="40px"
                align="center"
                cursor="pointer"
                _hover={{ bg: 'gray.50' }}
                onClick={() => handleClick(menu)}
              >
                <Text color="gray.400">{menu.name}</Text>
                <Divider />
              </Box>
            );
          })}
          <Box mb={4} />
        </>
      )}
      {toggleEdit ? (
        <>
          {/* 開催期間 */}
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
          <Box mb={4} />
          {/* 大会名 */}
          <Input
            bg="white"
            placeholder="大会名"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Box mb={4} />
          {/* 会場 */}
          <Input
            bg="white"
            placeholder="会場"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
          <Box mb={4} />
          <Button
            w="100%"
            colorScheme="teal"
            shadow="base"
            onClick={addTournamentMenu}
          >
            追加
          </Button>
        </>
      ) : (
        <Button
          w="100%"
          colorScheme="teal"
          shadow="base"
          onClick={() => setToggleEdit(true)}
          disabled={toggleEditMenu}
        >
          大会追加
        </Button>
      )}
    </div>
  );
};

export default CreateTournamentMenuDetail;
