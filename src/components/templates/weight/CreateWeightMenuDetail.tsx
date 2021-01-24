import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { db } from '../../../lib/firebase';
import { WeightName } from '../../../models/users';
import {
  isComposedState,
  selectedDateIdState,
  userState,
} from '../../../recoil/users/user';
import { Heading1,InputKeyDown, LinkButton } from '../../molecules';

const CreateWeightMenuDetail: FC = () => {
  const user = useRecoilValue(userState);
  const [isComposed, setIsComposed] = useRecoilState(isComposedState);
  const dateId = useRecoilValue(selectedDateIdState);

  // Local State
  const [menus, setMenus] = useState<WeightName[]>([]);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [toggleEditMenu, setToggleEditMenu] = useState(false);
  const [name, setName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState('');

  useEffect(() => {
    fetchTeamWeightMenu();
  }, [user]);

  const fetchTeamWeightMenu = async () => {
    if (user === null) return;
    const weightsRef = db
      .collection('teams')
      .doc(user.teamInfo.teamId)
      .collection('weightMenus')
      .orderBy('name', 'asc');
    await weightsRef.get().then((snapshot) => {
      const weightMenus: WeightName[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as WeightName;
        weightMenus.push(data);
      });
      setMenus(weightMenus);
    });
  };

  // 追加するメニューの入力処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // メニュー入力を離れた時の処理
  const createBlur = () => {
    setToggleEdit(false);
    setName('');
  };

  // チーム内の新しいメニュー追加処理
  const addTeamWeightMenu = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (user === null) return;
    if (isComposed) return;
    const weightsRef = db
      .collection('teams')
      .doc(user.teamInfo.teamId)
      .collection('weightMenus');
    if (e.key === 'Enter') {
      const {id} = weightsRef.doc();
      const newData: WeightName = { id, name };
      await weightsRef
        .doc(id)
        .set(newData, { merge: true })
        .then(() => {
          setMenus((prev) => [...prev, newData]);
          setName('');
        });
    }
  };

  // チーム内のメニューを編集する処理
  const editWeigthMenu = async (
    e: React.KeyboardEvent<HTMLElement>,
    id: string,
    idx: number
  ) => {
    if (user === null) return;
    if (isComposed) return;
    const weightsRef = db
      .collection('teams')
      .doc(user.teamInfo.teamId)
      .collection('weightMenus');

    if (e.key === 'Enter') {
      await weightsRef
        .doc(id)
        .update({ name })
        .then(() => {
          menus[idx] = { id, name };
          setMenus(menus);
          setToggleEditMenu(false);
          setName('');
        });
    }
  };

  // メニューの編集のためにそれぞれをクリックした時の処理
  const handleClick = (id: string, name: string) => {
    setName(name);
    setSelectedIndex(id);
    setToggleEditMenu(true);
  };

  const editBlur = () => {
    setToggleEditMenu(false);
    setName('');
  };

  return (
    <>
      <Flex justify="space-between" align="center">
        <Heading1 label="ウエイトメニュー" />
        <LinkButton label="戻る" link={`/weight/edit/${dateId}`} />
      </Flex>
      <Box mb={8} />
      {menus.length ? (
        <>
          {menus.map((menu, idx) => {
            if (toggleEditMenu && selectedIndex === menu.id) {
              return (
                <Input
                  textAlign="center"
                  autoFocus
                  key={menu.id}
                  value={name}
                  onChange={handleChange}
                  onKeyDown={(e) => editWeigthMenu(e, menu.id, idx)}
                  onBlur={editBlur}
                  onCompositionStart={() => setIsComposed(true)}
                  onCompositionEnd={() => setIsComposed(false)}
                />
              );
            } 
              return (
                <Box
                  key={menu.id}
                  h="40px"
                  bg="white"
                  lineHeight="40px"
                  textAlign="center"
                  overflow="hidden"
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  onClick={() => handleClick(menu.id, menu.name)}
                >
                  <Text color="gray.400">{menu.name}</Text>
                </Box>
              );
            
          })}
          <Box mb={8} />
          {toggleEdit ? (
            <InputKeyDown
              value={name}
              placeholder="新しいメニュー"
              maxW="100%"
              handleChange={handleChange}
              handleBlur={createBlur}
              addFunc={addTeamWeightMenu}
            />
          ) : (
            <Button shadow="base" w="100%" onClick={() => setToggleEdit(true)}>
              メニュー追加
            </Button>
          )}
        </>
      ) : (
        <Center>
          <Spinner color="gray.200" />
        </Center>
      )}
    </>
  );
};

export default CreateWeightMenuDetail;
