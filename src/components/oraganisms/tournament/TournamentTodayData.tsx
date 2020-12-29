import { Box, Button, Flex } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, useState, VFC } from 'react';
import { useRecoilValue } from 'recoil';

import GraphAllData from './GraphAllData';
import TableView from './TableView';
import { Heading2 } from '../../molecules';
import { selectedMakedMenuNameState } from '../../../recoil/users/user';
import { TournamentMenu } from '../../../models/users';

type Props = {
  windlessCalculation: (name: '100M' | '200M', menus: TournamentMenu[]) => void;
  toggleNoWind: boolean;
  setToggleNoWind: Dispatch<SetStateAction<boolean>>;
  windLessMenus: TournamentMenu[];
  filterMenus: TournamentMenu[];
};

const TournamentTodayData: VFC<Props> = ({
  windlessCalculation,
  toggleNoWind,
  setToggleNoWind,
  windLessMenus,
  filterMenus,
}) => {
  const selectedName = useRecoilValue(selectedMakedMenuNameState);
  const [hide, setHide] = useState(true);

  return (
    <>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading2 label="今回と前回の結果" />
        {selectedName === '100M' || selectedName === '200M' ? (
          toggleNoWind ? (
            <Button shadow="base" onClick={() => setToggleNoWind(false)}>
              元に戻す
            </Button>
          ) : (
            <Button
              shadow="base"
              onClick={() => windlessCalculation(selectedName, filterMenus)}
            >
              無風計算
            </Button>
          )
        ) : null}
        {hide ? (
          <Button shadow="base" onClick={() => setHide(false)}>
            大会名を表示
          </Button>
        ) : (
          <Button shadow="base" onClick={() => setHide(true)}>
            大会名を非表示
          </Button>
        )}
      </Flex>
      <TableView
        menus={toggleNoWind ? windLessMenus : filterMenus}
        hide={hide}
      />
      <Box mb={12} />

      <Heading2 label="記録遷移グラフ" />
      <Box mb={4} />
      <GraphAllData data={filterMenus} label="記録" />
    </>
  );
};

export default TournamentTodayData;
