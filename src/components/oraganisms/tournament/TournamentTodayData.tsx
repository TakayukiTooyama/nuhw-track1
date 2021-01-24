import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, useState, VFC } from 'react';
import { useRecoilValue } from 'recoil';

import { TournamentMenu } from '../../../models/users';
import { selectedMakedMenuNameState } from '../../../recoil/users/user';
import { Heading2 } from '../../molecules';
import GraphAllData from './GraphAllData';
import TableView from './TableView';

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
        <Heading2 label="今回の結果" />
        <HStack>
          {selectedName === '100M' || selectedName === '200M' ? (
            toggleNoWind ? (
              <Button
                size="sm"
                shadow="base"
                onClick={() => setToggleNoWind(false)}
              >
                元に戻す
              </Button>
            ) : (
              <Button
                size="sm"
                shadow="base"
                onClick={() => windlessCalculation(selectedName, filterMenus)}
              >
                無風計算
              </Button>
            )
          ) : null}
          <Button
            size="sm"
            shadow="base"
            leftIcon={hide ? <ViewOffIcon /> : <ViewIcon />}
            onClick={() => setHide((prev) => !prev)}
          >
            大会名
          </Button>
        </HStack>
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
