import {
  CloseIcon,
  HamburgerIcon,
  SearchIcon,
  ViewIcon,
  ViewOffIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  IconButton,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
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
import { SearchName, TournamentMenu, User } from '../../../models/users';
import { userState } from '../../../recoil/users/user';
import { ErrorMessage, InputText, TopScrollButton } from '../../molecules';
import SearchInBox from '../../molecules/common/SearchInBox';
import { TournamentViewTable } from '..';

type TournamenViewData = TournamentMenu & {
  user: {
    id: string;
    username: string;
    grade: string;
  };
};

const boxStyle = {
  bg: 'white',
  border: '1px solid',
  borderColor: 'gray.200',
  color: 'gray.400',
  fontWeight: 'normal',
  borderRadius: '5px',
};

const TournamentViewDetail: VFC = () => {
  // Global State
  const user = useRecoilValue(userState);
  const teamId = user?.teamInfo.teamId;
  const genderInfo = user?.gender;

  // Local State
  const [name, setName] = useState('');
  const [event, setEvent] = useState('');
  const [gender, setGender] = useState(genderInfo);
  const [menus, setMenus] = useState<TournamenViewData[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [toggleGender, setToggleGender] = useState(false);
  const [hide, setHide] = useState(false);
  const [toggleOfficial, setToggleOfficial] = useState(false);
  const [judgAllResult, setJudgAllResult] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  // チーム内の大会情報を取得
  const fetchTeamTournamentMenu = async (
    context: QueryFunctionContext<string>
  ) => {
    const teamId = context.queryKey[1];
    const teamTournamentMenusRef = db
      .collection('teams')
      .doc(teamId)
      .collection('tournamentMenus')
      .orderBy('startDate', 'asc');
    return await teamTournamentMenusRef.get().then((snapshot) => {
      const nameList = snapshot.docs.map((doc) => {
        const data = doc.data() as SearchName;
        const { name } = data;
        return name;
      });
      return [...nameList, '全試合'];
    });
  };

  const { data, isError } = useQuery<string[]>(
    ['nameList', teamId],
    fetchTeamTournamentMenu,
    {
      enabled: !!teamId,
      refetchOnWindowFocus: false,
    }
  );
  const eventData = ['100M', '200M', '400M', '800M', '100H', '110H', '400H'];

  const fetchTournamentSearchConditions = (
    userData: { id: string; username: string; grade: string; gender: string }[]
  ) => {
    if (data && data.every((item) => item !== name)) {
      setErrorMessage('登録してある大会名の中からお選びください。');
      return;
    }
    if (eventData && eventData.every((item) => item !== event)) {
      setErrorMessage('登録してある種目の中からお選びください。');
      return;
    }
    if (gender === '性別') {
      setErrorMessage('性別を選択してください。');
      return;
    }
    setLoading(true);

    // 検索結果を初期化
    setMenus([]);

    const genderFilter = userData.filter((data) => data.gender === gender);
    if (genderFilter.length > 0) {
      genderFilter.forEach(async (item) => {
        const tournamentsRef = db
          .collection('users')
          .doc(item.id)
          .collection('tournaments');

        // 全試合と全種目の場合分け
        const tournamentMenusRef =
          name === '全試合'
            ? tournamentsRef.where('competitionName', '==', event)
            : tournamentsRef
                .where('competitionName', '==', event)
                .where('data.name', '==', name);

        await tournamentMenusRef.get().then((snapshot) => {
          const tournamentMenus = snapshot.docs.map((doc) => {
            const data = doc.data() as TournamentMenu;
            return { ...data, user: item };
          });
          setMenus((prev) => prev.concat(tournamentMenus));
          if (name === '全試合') {
            setJudgAllResult(true);
          } else {
            setJudgAllResult(false);
          }
          setTimeout(() => {
            setLoading(false);
          }, 600);
        });
      });
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 600);
    }
  };

  const fetchId = async (context: QueryFunctionContext<string>) => {
    const teamId = context.queryKey[1];
    const usersRef = db
      .collection('users')
      .where('teamInfo.teamId', '==', teamId);

    return await usersRef.get().then((snapshot) => {
      const userData = snapshot.docs.map((doc) => {
        const { id } = doc;
        const data = doc.data() as User;
        const username = data.displayName;
        const { grade, gender } = data;
        return { id, username, grade, gender };
      });
      return userData;
    });
  };

  const filterNameList =
    data && data.filter((item) => item.indexOf(name) !== -1);

  const filterEventList = eventData.filter(
    (item) => item.indexOf(event) !== -1
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    setValue: Dispatch<SetStateAction<string>>
  ) => {
    setValue(e.target.value);
  };

  if (isError) return <ErrorMessage message="エラー" />;

  const { data: userData } = useQuery<
    { id: string; username: string; grade: string; gender: string }[]
  >(['userId', teamId], fetchId, {
    enabled: !!teamId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (errorMessage === '') return;
    setErrorMessage('');
  }, [name, event, gender]);

  const startDate = moment(`${menus[0]?.data.startDate}`).format('YYYY/MM/DD');
  const endDate = moment(`${menus[0]?.data.startDate}`).format('MM/DD');
  const filterMenus = menus?.map((menu) => ({
    ...menu,
    records: menu.records?.filter((record) => Number(record.wind) <= 2.0),
  }));

  const tableMenu = [
    { toggle: hide, setToggle: setHide, label: '日付・学年', top: '40px' },
    {
      toggle: toggleSearch,
      setToggle: setToggleSearch,
      label: '絞り込み',
      top: '80px',
    },
    {
      toggle: toggleOfficial,
      setToggle: setToggleOfficial,
      label: '公式タイム',
      top: '120px',
    },
  ];

  return (
    <Box width="100%">
      <Stack spacing={2} align="flex-start" direction={['column', 'row']}>
        <Box width="100%">
          <InputText
            maxW="100%"
            textAlign="center"
            value={name}
            placeholder="大会名"
            onChange={(e) => handleChange(e, setName)}
          />
          {filterNameList &&
          filterNameList.some((item) => item === name) ? null : (
            <SearchInBox nameList={filterNameList} setName={setName} />
          )}
        </Box>
        <HStack alignItems="flex-start" w="100%">
          <Stack spacing={1}>
            <Box
              as={Button}
              {...boxStyle}
              color="black"
              onClick={() => {
                setToggleGender((prev) => !prev), setGender('性別');
              }}
            >
              {gender && !toggleGender ? gender : '性別'}
            </Box>
            {toggleGender ? (
              <>
                {['男', '女'].map((gender) => (
                  <Box
                    as={Button}
                    key={gender}
                    onClick={() => {
                      setGender(gender), setToggleGender(false);
                    }}
                    {...boxStyle}
                  >
                    {gender}
                  </Box>
                ))}
              </>
            ) : null}
          </Stack>
          <Box w="100%">
            <InputText
              maxW="100%"
              textAlign="center"
              value={event}
              placeholder=" 競技種目"
              onChange={(e) => handleChange(e, setEvent)}
            />
            {filterEventList &&
            filterEventList.some((item) => item === event) ? null : (
              <SearchInBox nameList={filterEventList} setName={setEvent} />
            )}
          </Box>
          <IconButton
            aria-label="Search database"
            icon={<SearchIcon />}
            onClick={() =>
              userData && fetchTournamentSearchConditions(userData)
            }
          />
        </HStack>
      </Stack>
      <Box mb={1} />
      <ErrorMessage message={errorMessage} textAlign="left" />
      <Box mb={6} />
      {loading ? (
        <Box align="center" pt={[8, 6]}>
          <Spinner color="gray.400" />
        </Box>
      ) : (
        <>
          {filterMenus && filterMenus.length > 0 && (
            <>
              {(name === '全試合' && judgAllResult) || judgAllResult ? null : (
                <Box align="center" mb={[0, 6]} fontSize="18px">
                  <Text color="gray.400">
                    {menus.length && menus[0].data.venue}
                  </Text>
                  <Text color="gray.400">
                    {startDate.slice(5) === endDate
                      ? `${startDate}`
                      : `${startDate} 〜 ${endDate}`}
                  </Text>
                </Box>
              )}
              <Box display={['none', 'flex']} justifyContent="space-between">
                <Button
                  leftIcon={hide ? <ViewOffIcon /> : <ViewIcon />}
                  {...boxStyle}
                  onClick={() => setHide((prev) => !prev)}
                >
                  日付・学年
                </Button>
                <Button
                  leftIcon={toggleSearch ? <ViewIcon /> : <ViewOffIcon />}
                  {...boxStyle}
                  onClick={() => setToggleSearch((prev) => !prev)}
                >
                  絞り込み
                </Button>
                <Button
                  leftIcon={toggleOfficial ? <ViewIcon /> : <ViewOffIcon />}
                  {...boxStyle}
                  onClick={() => setToggleOfficial((prev) => !prev)}
                >
                  公式タイム
                </Button>
              </Box>
              <Box
                display={['flex', 'none']}
                justifyContent="flex-end"
                pos="relative"
              >
                <IconButton
                  aria-label="menu"
                  shadow="base"
                  icon={toggleMenu ? <CloseIcon /> : <HamburgerIcon />}
                  onClick={() => setToggleMenu((prev) => !prev)}
                />
                {toggleMenu ? (
                  <>
                    <Stack pos="absolute" spacing={0} top="42px" zIndex="1">
                      {tableMenu.map((item) => (
                        <Flex
                          key={item.label}
                          {...boxStyle}
                          h="40px"
                          w="180px"
                          align="center"
                          justify="space-between"
                          px={4}
                          borderRadius="0px"
                        >
                          {item.toggle ? <ViewIcon /> : <ViewOffIcon />}
                          {item.label}
                          <Checkbox
                            isChecked={item.toggle}
                            onChange={() => item.setToggle((prev) => !prev)}
                          />
                        </Flex>
                      ))}
                    </Stack>
                  </>
                ) : null}
              </Box>
              <Box mb={4} />
              <TournamentViewTable
                menus={toggleOfficial ? filterMenus : menus}
                hide={hide}
                toggleSearch={toggleSearch}
              />
            </>
          )}
          {filterMenus && filterMenus.length === 0 && (
            <Text textAlign="center" pt={6}>
              この種目の記録はありません
            </Text>
          )}
        </>
      )}
      <TopScrollButton />
    </Box>
  );
};

export default TournamentViewDetail;
