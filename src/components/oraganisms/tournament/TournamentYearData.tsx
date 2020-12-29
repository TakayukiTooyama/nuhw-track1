import { Box, Button, Flex } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, useState, VFC } from 'react';
import { useRecoilValue } from 'recoil';
import { selectedMakedMenuNameState } from '../../../recoil/users/user';
import GraphAllData from './GraphAllData';
import TableView from './TableView';
import { Heading2 } from '../../molecules';
import { TournamentMenu } from '../../../models/users';

type Props = {
  windlessCalculation: (name: '100M' | '200M', menus: TournamentMenu[]) => void;
  toggleNoWind: boolean;
  setToggleNoWind: Dispatch<SetStateAction<boolean>>;
  windLessMenus: TournamentMenu[];
  filterMenus1: TournamentMenu[];
  filterMenus2: TournamentMenu[];
};

const TournamentYearData: VFC<Props> = ({
  windlessCalculation,
  toggleNoWind,
  setToggleNoWind,
  windLessMenus,
  filterMenus1,
  filterMenus2,
}) => {
  const selectedName = useRecoilValue(selectedMakedMenuNameState);
  const [hide, setHide] = useState(false);

  return (
    <>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading2 label="年間結果" />
        {selectedName === '100M' || selectedName === '200M' ? (
          toggleNoWind ? (
            <Button shadow="base" onClick={() => setToggleNoWind(false)}>
              元に戻す
            </Button>
          ) : (
            <Button
              shadow="base"
              onClick={() => windlessCalculation(selectedName, filterMenus1)}
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
        menus={toggleNoWind ? windLessMenus : filterMenus2}
        hide={hide}
      />
      <Box mb={12} />

      <Heading2 label="記録遷移グラフ" />
      <Box mb={4} />
      <GraphAllData data={filterMenus2} label="記録" />
    </>
  );
};

export default TournamentYearData;
