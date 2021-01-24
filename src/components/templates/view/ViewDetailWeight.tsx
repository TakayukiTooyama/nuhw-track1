import { SearchIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton } from '@chakra-ui/react';
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  VFC,
} from 'react';
import { QueryFunctionContext, useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';

import { db } from '../../../lib/firebase';
import { SearchName, User, WeightMenu } from '../../../models/users';
import { userState } from '../../../recoil/users/user';
import { ErrorMessage, InputText, TopScrollButton } from '../../molecules';
import SearchInBox from '../../molecules/common/SearchInBox';
import { WeightViewTable } from '..';

type WeightViewData = WeightMenu & {
  user: {
    id: string;
    username: string;
  };
};

const WeightViewDetail: VFC = () => {
  // Global State
  const user = useRecoilValue(userState);
  const teamId = user?.teamInfo.teamId;
  const gender = user?.gender;

  // Local State
  const [name, setName] = useState('');
  const [rm, setRm] = useState('');
  const [menus, setMenus] = useState<WeightViewData[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  // チーム内のウエイトメニューを取得
  const fetchTeamWeightMenu = async (context: QueryFunctionContext<string>) => {
    const teamId = context.queryKey[1];
    const teamWeithMenusRef = db
      .collection('teams')
      .doc(teamId)
      .collection('weightMenus')
      .orderBy('name', 'asc');
    return await teamWeithMenusRef.get().then((snapshot) => {
      const nameList = snapshot.docs.map((doc) => {
        const data = doc.data() as SearchName;
        const {name} = data;
        return name;
      });
      return nameList;
    });
  };

  const { data, isError } = useQuery<string[]>(
    ['nameList', teamId],
    fetchTeamWeightMenu,
    {
      enabled: !!teamId,
      refetchOnWindowFocus: false,
    }
  );

  const fetchWeightSearchConditions = (
    userData: { id: string; username: string }[]
  ) => {
    if (data && data.every((item) => item !== name)) {
      setErrorMessage('登録してあるウエイト種目の中からお選びください。');
      return;
    }
    const regex = /[^0-9]/g;
    if (regex.test(rm)) {
      setErrorMessage('数字以外入力しないでください。');
      return;
    }
    if (rm === '') {
      setErrorMessage('RMを入力してください。');
      return;
    }
    // 検索結果を初期化
    setMenus([]);

    userData.forEach(async (item) => {
      const numberRM = Number(rm);
      const weightMenusRef = db
        .collection('users')
        .doc(item.id)
        .collection('weights')
        .where('name', '==', name)
        .where('rm', '==', numberRM);

      await weightMenusRef.get().then((snapshot) => {
        const weightMenus = snapshot.docs.map((doc) => {
          const data = doc.data() as WeightMenu;
          return { ...data, user: item };
        });
        setMenus((prev) => prev.concat(weightMenus));
      });
    });
  };

  const fetchId = async (context: QueryFunctionContext<string>) => {
    const teamId = context.queryKey[1];
    const gender = context.queryKey[2];
    const usersRef = db
      .collection('users')
      .where('teamInfo.teamId', '==', teamId)
      .where('gender', '==', gender);

    return await usersRef.get().then((snapshot) => {
      const userData = snapshot.docs.map((doc) => {
        const {id} = doc;
        const data = doc.data() as User;
        const username = data.displayName;
        return { id, username };
      });
      return userData;
    });
  };

  const filterNameList =
    data && data.filter((item) => item.indexOf(name) !== -1);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    setValue: Dispatch<SetStateAction<string>>
  ) => {
    setValue(e.target.value);
  };

  if (isError) return <ErrorMessage message="エラー" />;

  const { data: userData } = useQuery<{ id: string; username: string }[]>(
    ['userId', teamId, gender],
    fetchId,
    {
      enabled: !!teamId && !!gender,
      refetchOnWindowFocus: false,
    }
  );

  // クリック時にリフェッチ
  // const { data: project } = useQuery(
  //   ['weightMenu', ids],
  //   fetchWeightSearchConditions,
  //   {
  //     enabled: !!ids && refetch,
  //     refetchOnWindowFocus: refetch,
  //     retry: 6,
  //   }
  // );
  // const handleClick = () => {
  //   setRefetch(true);
  // };

  useEffect(() => {
    if (errorMessage === '') return;
    setErrorMessage('');
  }, [name, rm]);

  const format = (input: string) => `${input}kg`;

  return (
    <Box width="100%" maxW="500px" mx="auto">
      <HStack spacing={2} align="flex-start">
        <Box width="100%">
          <InputText
            textAlign="center"
            value={name}
            placeholder="ウエイト種目"
            onChange={(e) => handleChange(e, setName)}
          />
          {filterNameList &&
          filterNameList.some((item) => item === name) ? null : (
            <SearchInBox nameList={filterNameList} setName={setName} />
          )}
        </Box>
        <InputText
          value={rm}
          placeholder="RM"
          onChange={(e) => handleChange(e, setRm)}
          maxW="60px"
          textAlign="center"
        />
        <IconButton
          aria-label="Search database"
          icon={<SearchIcon />}
          onClick={() => userData && fetchWeightSearchConditions(userData)}
        />
      </HStack>
      <Box mb={1} />
      <ErrorMessage message={errorMessage} textAlign="left" />
      <Box mb={8} />
      {menus.length ? (
        <WeightViewTable menus={menus} label="セット" format={format} />
      ) : null}
      <TopScrollButton />
    </Box>
  );
};

export default WeightViewDetail;
