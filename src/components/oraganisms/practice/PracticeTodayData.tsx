import { Box, Flex, StatGroup } from '@chakra-ui/react';
import React, { Dispatch, VFC } from 'react';

import { insertStr } from '../../../hooks/useInsertStr';
import { Menu } from '../../../models/users';
import { PinInput,Stat } from '../../molecules';
import { Heading2 } from '../../molecules/common/Heading';
import { Comparison } from '../../templates/practice/PracticeViewDetail';
import { GraphAllData, TableView } from '..';

type Props = {
  data: Menu[];
  lastTimeData: Menu[];
  changeNumber: string;
  comparisonAry: Comparison[];
  setChangeNumber: Dispatch<React.SetStateAction<string>>;
};

const PracticeTodayData: VFC<Props> = ({
  data,
  lastTimeData,
  changeNumber,
  comparisonAry,
  setChangeNumber,
}) => {
  const format = (input: string) => {
    const len = input.length;
    if (len === 1) {
      return `0"0${  input}`;
    }
    if (len === 2) {
      return `0"${  input}`;
    }
    if (len > 2 && len < 5)
      return `${input.slice(0, len - 2)  }"${  input.slice(len - 2, len)}`;
    if (len > 4 && len < 7)
      return (
        `${input.slice(0, len - 4) 
        }'${ 
        input.slice(len - 4, len - 2) 
        }"${ 
        input.slice(len - 2, len)}`
      );
    return input;
  };

  return (
    <>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading2 label="今回と前回の記録" />
        <PinInput value={changeNumber} setValue={setChangeNumber} />
      </Flex>
      <TableView menus={lastTimeData} label="本目" format={insertStr} />
      <Box mb={12} />

      <Heading2 label="前回比較" />
      <StatGroup ml={6}>
        {comparisonAry.map((item, idx) => (
          <Stat
            key={idx.toString()}
            type={item.type}
            data={item.data}
            label="本目"
            idx={idx}
            format={format}
          />
        ))}
      </StatGroup>
      <Box mb={12} />

      <Heading2 label="記録遷移グラフ" />
      <GraphAllData
        data={data}
        format={insertStr}
        label="タイム"
        axisLabel="本目"
      />
    </>
  );
};

export default PracticeTodayData;
