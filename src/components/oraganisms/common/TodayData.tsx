import { Box, Flex, SimpleGrid, StatGroup, Text } from '@chakra-ui/react';
import React, { Dispatch, SetStateAction, VFC } from 'react';

import { Comparison, Menu } from '../../../models/users';
import { Heading2, PinInput, Stat } from '../../molecules';
import { GraphAllData, TableView } from '..';

type Props = {
  todayData: Menu[];
  lastTimeData: Menu[];
  tableLabel: string;
  graphLabel: string;
  statLabel: string;
  format: (input: string) => string;
  judgLastTime: boolean;
  changeNumber: string;
  setChangeNumber: Dispatch<SetStateAction<string>>;
  comparisonAry: Comparison[];
};

const TodayData: VFC<Props> = ({
  todayData,
  lastTimeData,
  tableLabel,
  graphLabel,
  statLabel,
  format,
  judgLastTime,
  changeNumber,
  setChangeNumber,
  comparisonAry,
}) => {
  return (
    <div>
      {todayData.length > 0 && lastTimeData.length > 0 ? (
        <>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading2 label="今回と前回の記録" />
            <PinInput value={changeNumber} setValue={setChangeNumber} />
          </Flex>

          <TableView
            menus={judgLastTime ? todayData : lastTimeData}
            label={tableLabel}
            format={format}
          />
          <Box mb={12} />

          <Heading2 label="前回比較" />
          <Box mb={4} />
          {comparisonAry.some((items) => items.data >= 0) ? (
            <SimpleGrid columns={[3, 5, 6]} spacing={4}>
              {comparisonAry.map((item, idx) => (
                <Stat
                  key={idx.toString()}
                  type={item.type}
                  data={item.data}
                  label={statLabel}
                  idx={idx}
                  format={format}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Text align="center">前回の記録がありません</Text>
          )}
          <Box mb={12} />

          <Heading2 label="記録遷移グラフ" />
          <Box mb={4} />
          <GraphAllData
            data={todayData}
            label={graphLabel}
            axisLabel={statLabel}
            format={format}
          />
        </>
      ) : (
        <Text pl={4}>まだ登録されていません</Text>
      )}
    </div>
  );
};

export default TodayData;
